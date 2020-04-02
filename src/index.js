const path = require("path");
const RpcTask = require('./rpctask');
const parser = require('./parser')

class SdkApi {
    constructor(xip, xport, dip, dport) {
        this._et = new RpcTask(xip, xport, false);
        if(dip && dport) {
            this._db = new RpcTask(dip, dport, false); 
        }
    }

    //执行服务器api
    xfn(method, params, callback) {
        this._et.sendTask({method: method, params: params}, callback);
    }

    //数据服务器api
    dfn(method, params, callback) {
        this._db.sendTask({method: method, params: params}, callback);
    }

    //创建执行环境
    makeenv(proj_path, callback) {
        let proj_apath = path.isAbsolute(proj_path) ? proj_path : path.resolve(proj_path);
        this.xfn('makeenv', {proj_apath: proj_apath, protos: "aa", devices: null}, callback);
    }

    //开始执行程序
    start(proj_path, src_path, vars, option, callback) {
        let asts = parser.getRunAstList(proj_path, src_path);
        if(!asts || asts.length===0) {
            return;
        }
        asts[0].vars = vars;
        asts[0].option = option;
        this.xfn('start', asts, callback);
    }

}

module.exports = SdkApi;
