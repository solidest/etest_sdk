const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const runParser = require('./runParser');
const RpcTask = require('../driver/RpcTask');
const NetWork = require('../driver/NetWork');
const protocols = require('../etl/protocols');
const parseHardEnv = require('../etl/devices');
const etlHelper = require('../etl/helper');

class SdkApi {
    constructor(ip, port) {
        let net = new NetWork();
        this._srv = new RpcTask(net);
        net.open(ip, port);
    }

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

    setup(cfg, callback) {
        try {

            let pf = path.isAbsolute(cfg.project.path) ? cfg.project.path : path.resolve(cfg.project.path);
            let asts = etlHelper.parse_proj_etl(pf);

            let prots = protocols(asts);
            let topos = parseHardEnv(asts);
            let xtras = cfg.project.xtras ? JSON.parse(JSON.stringify(cfg.project.xtras)):{};

            if(xtras.pack) {
                xtras.pack = etlHelper.read_text(xtras.pack, pf);
            }
            if(xtras.unpack) {
                xtras.unpack = etlHelper.read_text(xtras.unpack, pf);
            }
            if(xtras.check) {
                xtras.check = etlHelper.read_text(xtras.check, pf);
            }
            if(xtras.recvfilter) {
                xtras.recvfilter = etlHelper.read_text(xtras.recvfilter, pf);
            }

            let libs = cfg.project.lib_path;
            if (libs) {
                let plibs = path.resolve(pf, libs);
                let dir = fs.readdirSync(plibs);
                libs = [];
                for (let p of dir) {
                    if (path.extname(p) !== '.lua') {
                        continue;
                    }
                    libs.push({file: p, code: etlHelper.read_text(p, plibs)});
                }
            } else {
                libs = [];
            }

            let env = {
                proj_id: cfg.project.id,
                prots: prots,
                xtras: xtras,
                topos: topos,
                libs: libs
            };
            return this._xfn('makeenv', env, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }


    start_quick(cfg, run_id, callback) {
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
            if (!src.endsWith('.lua')) {
                throw new Error('无效脚本文件');
            }

            let ast = runParser.getSrcAst('lua', pf, src);
            let option = run.option || {};
            if (run.topology) {
                option.topology = run.topology;
            }

            ast.option = option;
            if(typeof run.vars === 'object') {
                if(Array.isArray(run.vars)) {
                    let vs = [];
                    for(let f of run.vars) {
                        vs = vs.concat(yaml.safeLoad(fs.readFileSync(f, 'utf8')));
                    }
                    ast.vars = vs;
                } else {
                    ast.vars = run.vars;
                }
            } else if(typeof run.vars === 'string'){
                let f = path.resolve(pf, run.vars) 
                ast.vars = yaml.safeLoad(fs.readFileSync(f, 'utf8'));
            } else {
                console.log('type of vars is ', typeof run.vars)
            }
            ast.proj_id = cfg.project.id;
            return this._xfn('start', ast, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    start(cfg, run_id, callback) {
        return this.setup(cfg, (err) => {
            if (err) {
                return callback(err);
            }
            return this.start_quick(cfg, run_id, callback);
        });
    }

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

    state(callback) {
        try {
            return this._xfn('state', null, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    ping(callback) {
        try {
            return this._xfn('ping', null, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

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

    reply(run_id, answer, callback) {
        try {
            answer.key = run_id;
            return this._xfn('reply', answer, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

    cmd(run_id, command, params, callback) {
        try {
            return this._xfn('command', {
                key: run_id,
                command: command,
                params: params
            }, callback);
        } catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }

}

module.exports = SdkApi;