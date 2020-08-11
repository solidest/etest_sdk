
import wins from '../feature/m_wins';
import m_db from '../feature/m_db';
import load_proj from './wrapper/loader';
import Runner from './Runner';
import RunDb from './RunDb';
import {
    ipcMain,
  } from 'electron';
import Project from './wrapper/Project';
import Protocol from './wrapper/Protocol';

let _db_path;
let _player;

let _db;
let _runner;

function open(player, db_path) {
    _player = player;
    _db_path = db_path;
}

function close() {
    if(_runner) {
        _runner.close();
        _runner = null;
    }
}

function on_debug(kind, info, proj_id, case_id) {
    _player.webContents.send('debug', kind, info, proj_id, case_id);
    let win = wins.find(proj_id);
    if (win) {
        win.webContents.send('debug', kind, info, proj_id, case_id);
    }
    if(kind == 'error') {
        close();
    }
}

function on_ask(ask) {
    _player.webContents.send('run-ask', ask);
}


async function run_case(info) {
    try {
        let db, runner;
        if (info.remake) {
            let proj = load_proj(info.proj_id);

            if(_db && info.proj_id == _db.proj_id) {
                db = _db;
            } else {
                db = new RunDb(info.proj_id, _db_path);
                let res = await db.open();
                if(res.result !== 'ok') {
                    return res;
                }                
            }
            db.save_proj(proj);

            runner = new Runner(proj.setting.etestd_ip, proj.setting.etestd_port, on_debug, on_ask);
            let res = await runner.open();
            if(res.result !== 'ok') {
                return res;
            }
            res = await runner.make_env(proj);
            if(res.result !== 'ok') {
                return res;
            }
        } else {
            if(!_db || !_runner || _db.proj_id !== info.proj_id) {
                return {
                    result: 'error',
                    value: '启动执行异常',
                }
            }
            db = _db;
            runner = _runner;
        }
        let item = db.find_case(info.id);
        let play_info = {
            proj_id: info.proj_id,
            proj_name: db.proj.name,
            case_id: item.id,
            case_name: item.name,
            panel: item.panel,
        }

        db.clear_outs(info.id);
        let res = await runner.run_case(info.id, db);
        if(res.result === 'ok') {
            on_debug('play', play_info, info.proj_id, info.id);
            _runner = runner;
            _db = db;
        }
        res.$is_panel = !!item.panel;
        return res;
    } catch (error) {
        return {
            result: 'error',
            value: error.message
        }
    }
}

async function run_stop() {
    if(!_runner) {
        return {
            result: 'error',
            value: '没有需要停止的执行',
        };
    }
    return await _runner.run_stop();
}


ipcMain.handle('run-test', async (_, info) => {
    try {

        let db = new RunDb(info.proj_id, _db_path);
        let res = await db.open();
        if(res.result !== 'ok') {
            return res;
        }                
        let proj = m_db.load_proj(info.proj_id);
        proj = new Project(proj);
        if(info.prot_id) {
            let item = m_db.load('protocol', info.prot_id);
            let doc = m_db.load('doc', info.prot_id);      
            proj.addKind('protocol', new Protocol(doc, proj, item.name));      
        }
        proj = proj.make_out();
        if(!proj.setting || !proj.setting.etestd_ip || !proj.setting.etestd_port) {
            return {
                result: 'error',
                value: '执行器连接设置错误'
            }
        }
        db.proj = proj;

        
        let runner = new Runner(proj.setting.etestd_ip, proj.setting.etestd_port, on_debug, on_ask);
        res = await runner.open();
        if(res.result !== 'ok') {
            return res;
        }
        let env = {
            proj_id: proj.id,
            prots: proj.prots,
        };
        res = await runner.make_test_env(env);
        if(res.result !== 'ok') {
            return res;
        }

        let case_info = {
            proj_id: info.proj_id,
            script: info.script,
            vars: info.vars,
            option: info.option,
            rpath_src: './' + info.name + '.lua',
        }
        db.clear_outs(info.id);
        res = await runner.run_test_case(case_info, db, info.id);
        if(res.result === 'ok') {
            _runner = runner;
            _db = db;
        }
        return res;
    } catch (error) {
        return {
            result: 'error',
            value: error.message
        }
    }
});

ipcMain.handle('get-outs', (_, info) => {
    if(!_db) {
        return null;
    }
    return _db.get_outs(info);
});

ipcMain.on('run-cmd', (_, cmd, commander) => {
    if(_runner) {
        _runner.run_cmd(cmd, commander);
    } else {
        on_debug('error', '执行器已经停止', 0, 0)
    }
});

ipcMain.on('run-reply', (_, answer) => {
    if(_runner) {
        _runner.run_reply(answer);
    } else {
        on_debug('error', '执行器已经停止', 0, 0)
    }
})

export default {
    open,
    close,
    run_case,
    run_stop,
}