const path = require('path');
const fs = require('fs');
const RpcTask = require('./rpctask');
const parser = require('./parser');
const protocols = require('./protocols');
const devices = require('./devices');

class SdkApi {
    constructor(ip, port) {
        this._srv = new RpcTask(ip, port, false);
    }

    //执行服务器api
    _xfn(method, params, callback) {
        try {
            return this._srv.sendTask({method: method, params: params}, callback);
        } catch (error) {
            if(callback) {
                callback(error, null);
            }
        }
    }

    //创建执行环境
    makeenv(proj_path, callback) {
        try {
            let proj_apath = path.isAbsolute(proj_path) ? proj_path : path.resolve(proj_path);
            let protos = protocols(path.join(proj_apath, 'protocol'));
            let devs = devices(path.join(proj_apath, 'device'));
            let xtra_path = path.join(proj_apath, 'protocol', 'xtra.lua');
            let xtra = null;
            if(fs.existsSync(xtra_path)) {
                xtra = fs.readFileSync(xtra_path, 'utf8');
            }
            return this._xfn('makeenv', {proj_apath: proj_apath, protos: protos, proto_xtra: xtra, devices: devs}, callback);
        } catch (error) {
            if(callback) {
                callback(error);
            }
        }
    }

    //开始执行程序
    start(proj_path, src_path, vars, option, callback) {
        try {
            let asts = parser.getRunAstList(proj_path, src_path);
            if(!asts || asts.length===0) {
                return;
            }
            asts[0].vars = vars;
            asts[0].option = option;
            return this._xfn('start', asts, callback);
        } catch (error) {
            if(callback) {
                callback(error);
            }
        }
    }

    //读取执行输出
    readout(run_id, callback) {
        try {
            return this._xfn('readout', {key: run_id}, callback);
        } catch (error) {
            if(callback) {
                callback(error);
            }
        }
    }

    //查询执行状态
    state(callback) {
        try {
            return this._xfn('state', null, callback);
        } catch (error) {
            if(callback) {
                callback(error);
            }
        }
    }

    //停止执行
    stop(run_id, callback) {
        try {
            return this._xfn('stop', {key: run_id}, callback);
        } catch (error) {
            if(callback) {
                callback(error);
            }
        }
    }

}

module.exports = SdkApi;
