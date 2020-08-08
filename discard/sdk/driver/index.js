
/**
 * ETest驱动程序
 */

const SdkApi = require('../index.js');
const print = require('./print');
const parse_out = require('./parse_out');
const yaml = require('js-yaml');
const fs = require('fs');

let _srv = null;
let _run_id = null;
let _timer = null;

//退出执行
function _exit() {
    if (_timer) {
        clearInterval(_timer);
        _timer = null;
    }
    process.exit(0);
}

//命令执行回调
function _callback(err, res, id) {
    if (err) {
        return print.sys_error(err.message ? err.message : err, id);
    }
    return print.sys_recved(id, res);
}

//读取执行输出
function _read_out() {
    if (!_run_id) {
        return;
    }
    _srv.readout(_run_id, (err, res, id) => {
        if (err) {
            print.sys_error(id, err);
            _exit();
            return;
        }
        if(parse_out(res)) {
            _exit();
            return;
        }
    });
}

//确认已连接服务器
function _check_cfg(idxfile) {
    if(_srv) {
        return yaml.safeLoad(fs.readFileSync(idxfile, 'utf8'));
    }
    let cfg = yaml.safeLoad(fs.readFileSync(idxfile, 'utf8'));
    _srv = new SdkApi(cfg.project.etestd_ip, cfg.project.etestd_port);
    return cfg;
}

//查询下位机状态
function cmd_state(idxfile) {
    _check_cfg(idxfile);
    let id = _srv.state((err, res, id) => {
        _callback(err, res, id);
        process.exit(0);
    });
    print.sys_sended(id, 'state');
}

//停止下位机执行
function cmd_stop(idxfile) {
    _check_cfg(idxfile);
    let cid = _srv.state((err, res, id) => {
        _callback(err, res, id);
        if (res && res != 'idle') {
            _srv.stop(res, (err, res, id) => {
                _callback(err, res, id);
                _exit();
            });
            print.sys_sended(id, 'stop');
        } else {
            _exit();
        }
    });
    print.sys_sended(cid, 'state');
}

//安装执行环境
function cmd_setup(idxfile) {
    let cfg = _check_cfg(idxfile);
    let id = _srv.setup(cfg, (err, res, id)=>{
        _callback(err, res, id);
        _exit();
    });
    print.sys_sended(id, 'setup');
}

//执行实例
function cmd_run(idxfile, runid) {
    let cfg = _check_cfg(idxfile);
    _run_id = null;
    let id = _srv.start(cfg, runid, (err, res, id)=>{
        _callback(err, res, id);
        if (res) {
            _run_id = res;
        }
    });
    print.sys_sended(id || ' ', 'run ' + runid);
    _timer = setInterval(_read_out, 40);
}

module.exports = {
    cmd_state, cmd_stop, cmd_setup, cmd_run
}
