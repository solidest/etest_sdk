const path = require('path');
const fs = require('fs');
const RpcTask = require('./rpctask');
const parser = require("./parser/etxParser")
const parser_run = require('./parser');
const protocols = require('./protocols');
const devices = require('./devices');

class SdkApi {
    constructor(ip, port) {
        this._srv = new RpcTask(ip, port, false);
    }

    //执行服务器api
    _xfn(method, params, callback) {
        try {
            return this._srv.sendTask({
                method: method,
                params: params
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error, null);
            }
        }
    }

    //获取目录下所有的etl文件
    _get_etl_files(pf, results) {
        if (!fs.existsSync(pf)) {
            return;
        }

        let st = fs.statSync(pf);
        if (st.isFile()) {
            if (path.extname(pf) !== '.etl') {
                return;
            }
            results.push(pf);
            return;
        }

        if (st.isDirectory()) {
            let dir = fs.readdirSync(pf);
            for (let p of dir) {
                this._get_etl_files(path.join(pf, p), results);
            }
        }
    }

    //解析etl文件列表
    _parse_etl(files, proj_apath) {
        let asts = [];
        for (let f of files) {
            let text = fs.readFileSync(f, "utf8");
            let ast = parser.parse(text);
            if (ast) {
                for (let a of ast) {
                    a.src = path.relative(proj_apath, f);
                }
                asts = asts.concat(ast);
            }
        }
        return asts;
    }

    //读取文本文件内容
    _read_text(file, proj_apath) {
        let f = path.resolve(proj_apath, file);
        if (fs.existsSync(f)) {
            return fs.readFileSync(f, 'utf8');
        }
        throw new Error(`文件 ${f} 未找到`);
    }

    //安装执行环境
    setup(cfg, callback) {
        try {
            let pf = cfg.project.path;
            pf = path.isAbsolute(pf) ? pf : path.resolve(pf);
            let files = [];
            this._get_etl_files(pf, files);
            let asts = this._parse_etl(files, pf);

            let protos = protocols(asts);
            let devs = devices(asts);
            let xtra = cfg.project.xtra;
            if (xtra) {
                xtra = this._read_text(xtra, pf);
            }
            let env = {
                proj_id: cfg.project.id,
                protos: protos,
                proto_xtra: xtra,
                devices: devs
            };
            return this._xfn('makeenv', env, callback);
        } catch (error) {
            // console.log(error)
            if (callback) {
                callback(error);
            }
        }
    }

    //开发模式下执行程序
    start(cfg, run_id, callback) {
        //开发模式需要先设置环境
        return this.setup(cfg, (err) => {
            if (err) {
                return callback(err);
            } else {
                try {
                    let pf = cfg.project.path;
                    pf = path.isAbsolute(pf) ? pf : path.resolve(pf);
                    let run = cfg.program[run_id];
                    if (!run) {
                        throw new Error(`实例"${run_id}"未找到`);
                    }
                    if (!run.src) {
                        throw new Error(`实例"${run_id}"未设置src属性`);
                    }
                    let src = path.resolve(pf, run.src);
                    if (!fs.existsSync(src)) {
                        throw new Error(`文件"${src}"未找到`);
                    }

                    let asts = parser_run.getRunAstList(pf, src);
                    if (!asts || asts.length === 0) {
                        return;
                    }
                    let option = {};
                    if (run.topology) {
                        option.topology = run.topology;
                    }

                    asts[0].option = option;
                    asts[0].vars = run.vars;
                    asts[0].proj_id = cfg.project.id;

                    return this._xfn('start', asts, callback);
                } catch (error) {
                    if (callback) {
                        callback(error);
                    }
                }
            }
        });
    }

    //创建执行环境
    // makeenv(proj_path, callback) {
    //     try {
    //         let proj_apath = path.isAbsolute(proj_path) ? proj_path : path.resolve(proj_path);
    //         let protos = protocols(path.join(proj_apath, 'protocol'));
    //         let devs = devices(path.join(proj_apath, 'device'));
    //         let xtra_path = path.join(proj_apath, 'protocol', 'xtra.lua');
    //         let xtra = null;
    //         if(fs.existsSync(xtra_path)) {
    //             xtra = fs.readFileSync(xtra_path, 'utf8');
    //         }
    //         if(protos && protos.length === 0) {
    //             protos = null;
    //         }
    //         if(devs && devs.length === 0) {
    //             devs = null;
    //         }
    //         return this._xfn('makeenv', {proj_apath: proj_apath, protos: protos, proto_xtra: xtra, devices: devs}, callback);
    //     } catch (error) {
    //         if(callback) {
    //             callback(error);
    //         }
    //     }
    // }


    //开始执行程序
    // start(proj_path, src_path, vars, option, callback) {
    //     try {
    //         let asts = parse_all.getRunAstList(proj_path, src_path);
    //         if(!asts || asts.length===0) {
    //             return;
    //         }
    //         asts[0].vars = vars;
    //         asts[0].option = option;
    //         return this._xfn('start', asts, callback);
    //     } catch (error) {
    //         if(callback) {
    //             callback(error);
    //         }
    //     }
    // }

    //读取执行输出
    readout(run_id, callback) {
        try {
            return this._xfn('readout', {
                key: run_id
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //查询执行状态
    state(callback) {
        try {
            return this._xfn('state', null, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    //停止执行
    stop(run_id, callback) {
        try {
            return this._xfn('stop', {
                key: run_id
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

}

module.exports = SdkApi;