
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import SdkApi from '../core/driver_vsc';
import cach from './cachdb';
import {
    ipcMain, dialog
} from 'electron';

const idxfile = 'run/index.yml'

let _render = null;
let _config = null;
let _srv = null;
let _timer = null;
let _run_uuid = null;
let _last_uuid = null;
let _isDevelopment = false;

//推送系统错误信息
function send_sys_err(msg, code) {
    _render.webContents.send('sys-error', msg, code);
}

//推送系统信息
function send_sys_info(time, msg, msg_type) {
    _render.webContents.send('sys-info', time, msg, msg_type);
}

//推送下位机问询
function send_ask(ask_info) {
    _render.webContents.send('ask', ask_info);
}

//推送系统状态变更
function send_sys_state(state, opt) {
    _render.webContents.send('sys-state', state, opt);
}

//缓冲数据记录并发送通知
function save_send_rcd(rcds) {
    let len = rcds.length;
    //发送通知给UI
    _render.webContents.send('record', len, rcds[0].time, rcds[len-1].time);
    //缓冲数据记录
    cach.save(_run_uuid||_last_uuid, rcds);
}

//推送输出记录
function send_out(logs) {
    if (!logs) {
        return;
    }
    let rcds = [];
    for (let r of logs) {
        if (r.catalog === 'system') {
            switch (r.kind) {
                case 'stop':
                    _run_uuid = null;
                    send_sys_state('idle');
                    break;

                case 'error':
                    send_sys_err((r.value && r.value.message) ? r.value.message : JSON.stringify(r), 'e1');
                    break;

                case 'print':
                case 'verifyFail':
                case 'assertFail':
                    send_sys_info(r.time, r.value, r.kind);
                    break;

                case 'start':
                case 'entry':
                case 'exit':
                    break;

                default:
                    return dialog.showErrorBox('error2', JSON.stringify(r));
            }
        } else if (r.catalog === 'log') {
            send_sys_info(r.time, r.value, 'log_' + r.kind);
        } else if (r.catalog === 'record') {
            rcds.push(r);
        } else if (r.catalog === 'ask') {
            let info = r.value;
            info.kind=r.kind;
            send_ask(info);
        }
        else {
            dialog.showErrorBox('error3', JSON.stringify(r));
        }
    }
    if(rcds.length>0) {
        //_render.webContents.send('records', rcds);
        save_send_rcd(rcds);
    }
}


//读取执行输出
function read_out() {
    if (!_run_uuid) {
        return;
    }

    _srv.readout(_run_uuid, (err, res) => {
        if (err) {
            return send_sys_err(err, 'e2');
        } else {
            return send_out(res);
        }
    });
}


//停止执行
function stop() {
     _srv.state((err, res) => {
        if(err) {
            return send_sys_err(err, 'e31');
        }
        if (res && res != 'idle') {
            _srv.stop(res, (err) => {
                if(err) {
                    return send_sys_err(err, 'e32');
                }
            });
        }
    });
}

//执行用例
function run(_, run_id, option) {
    if(option) {
        let run = _config.program[run_id];
        if (!run.option) {
            run.option = {}
        }
        for(let k in option) { //option合并
            run.option[k] = option[k];
        }
    }

    if(_isDevelopment) {
        _srv.start(_config, run_id, (err, res)=>{
            if(err) {
                return send_sys_err(err.message||err, 'e4');
            }
            _run_uuid = res;
            _last_uuid = res;
            return send_sys_state('running', res);
        });
    } else {
        _srv.start(_config, run_id, (err, res)=>{
            if(err) {
                return send_sys_err(err.message||err, 'e4');
            }
            _run_uuid = res;
            _last_uuid = res;
            return send_sys_state('running', res);
        });
        // _srv.start_quick(_config, run_id, (err, res)=>{
        //     if(err) {
        //         return send_sys_err(err.message||err, 'ee4');
        //     }
        //     _run_uuid = res;
        //     _last_uuid = res;
        //     return send_sys_state('running', res);
        // });
    }
}

//发送命令给etestx
function cmd(_, cmd_id, params) {
    if(!_run_uuid) {
        return console.log('无效的命令', cmd_id);
    }

    _srv.cmd(_run_uuid, cmd_id, params, (err) => {
        if(err) {
            return send_sys_err(err, 'cmd' + cmd_id);
        }
    });
}

//更新下位机状态
function state() {
    _srv.state((err, res) => {
        if(err) {
            return send_sys_err(err, 'e5');
        } else {
            if(res==='idle') {
                send_sys_state('idle');
            } else {
                send_sys_state('running', res);
            }
        }
    });
}

//初始化执行环境
function setup(render, isDevelopment) {
    try {
        _isDevelopment = isDevelopment;
        _render = render;
        let f = path.join(__static, idxfile);
        _config = yaml.safeLoad(fs.readFileSync(f, 'utf8'));
        _config.project.path = path.join(__static, 'run');
        _srv = new SdkApi(_config.project.etestd_ip, _config.project.etestd_port);
        _timer = setInterval(read_out, 40);
        state();
    } catch (error) {
        dialog.showErrorBox('error1', error.message);
    }
}

//回复下位机问询
function reply(_, answer) {
    if(!_run_uuid) {
        return;
    }
    _srv.reply(_run_uuid, answer, (err, res) => {
        //dialog.showErrorBox('temp1', JSON.stringify(res));
        if(err || res!=='ok') {
            return send_sys_err(err||res, 'e6');
        }
    });
}


//释放执行环境
function release() {
    stop();
    if(_timer) {
        clearInterval(_timer);
        _timer = null;
    }
}

//查询数据记录
function find(e, filter, sort, limit) {
    let res = [];
    try {
        res = cach.find(_run_uuid||_last_uuid, filter, sort, limit);
    } catch (error) {
        send_sys_err(error.message, 'e7');
    }
    e.sender.send('db-find-reply', res);
}
function findlist(e, options) {
    let res = [];
    try {
        for(let option of options) {
            // console.log(option)
            res.push(cach.find(_run_uuid||_last_uuid, option.filter, option.sort, option.limit))
        }
    } catch (error) {
        send_sys_err(error.message, 'e7_1');
    }
    e.sender.send('db-findlist-reply', res);
}

//查询最新数据片段
function last(e, filter, sort, limit) {
    let res = [];
    try {
        res = cach.last(_run_uuid||_last_uuid, filter, sort, limit);
    } catch (error) {
        send_sys_err(error.message, 'e8');
    }
    e.sender.send('db-last-reply', res);
}

function lastlist(e, options) {
    let res = [];
    try {
        for(let option of options) {
            let arr = cach.last(_run_uuid||_last_uuid, option.filter, option.sort, option.limit);
            // console.log('res:', option, arr.length);
            res.push(arr);
        }
    } catch (error) {
        send_sys_err(error.message, 'e8_1');
    }
    e.sender.send('db-lastlist-reply', res);
}


//合并记录形成状态值
function merge(e, filter) {
    let res = {};
    try {
        res = cach.merge(_run_uuid||_last_uuid, filter);
    } catch (error) {
        send_sys_err(error.message, 'e9');
    }
    e.sender.send('db-merge-reply', res);
}


ipcMain.on('cmd-stop', stop);
ipcMain.on('cmd-run', run);
ipcMain.on('cmd-reply', reply);
ipcMain.on('cmd-cmd', cmd);
ipcMain.on('db-find', find);
ipcMain.on('db-last', last);
ipcMain.on('db-findlist', findlist);
ipcMain.on('db-lastlist', lastlist);
ipcMain.on('db-merge', merge);

export default {
    setup,
    release
}