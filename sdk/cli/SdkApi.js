const path = require('path');
const RpcTask = require('../driver/RpcTask');
const NetWork = require('../driver/NetWork');
const ETL = require('../etl');

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
            let env = ETL.makeout_etl2env(cfg);
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
            let run_info = ETL.makeout_etl2run(cfg.project.id, pf, run);
            return this._xfn('start', run_info, callback);
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