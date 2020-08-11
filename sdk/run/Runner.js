const RpcTask = require('../../sdk/core/rpctask');

class Runner {
    constructor(ip, port, on_debug, on_ask) {
        this.ip = ip;
        this.port = port;
        this.on_debug = on_debug;
        this.on_ask = on_ask;
    }

    get proj_id() {
        if (this.db) {
            return this.db.proj_id;
        }
        return null;
    }

    _xfn(method, params) {
        return new Promise(resolve => {
            try {
                if (!this.srv) {
                    return resolve({
                        result: 'error',
                        value: '',
                    });
                }
                this.srv.sendTask({
                    method: method,
                    params: params
                }, (err, value) => {
                    if (err) {
                        return resolve({
                            result: 'error',
                            value: err.message || err,
                        });
                    }
                    return resolve({
                        result: 'ok',
                        value: value
                    });
                });
            } catch (error) {
                return resolve({
                    result: 'error',
                    value: error.message
                });
            }
        });
    }

    open() {
        return new Promise(resolve => {
            let self = this;
            this.srv = new RpcTask(this.ip, this.port, false, (err)=>{
                if(err) {
                    return resolve({
                        result: 'error',
                        value: err,
                    });
                } else {
                    self.srv.setup((err_msg) => {
                        self.close();
                        self.on_debug('error', err_msg, self.proj_id, self.case_id);
                    });
                    return resolve({
                        result: 'ok'
                    });
                }
            });      
        })
    }

    clear() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    close() {
        this.clear();
        if (this.srv) {
            this.srv.close();
            this.srv = null;
        }
    }

    _start_readout(db, case_id, uuid) {
        this.run_uuid = uuid;
        let self = this;
        this.timer = setInterval(async () => {
            let outs = await self._xfn('readout', {
                key: self.run_uuid,
            });
            if (outs.result !== 'ok') {
                self.close();
                self.on_debug('error', outs.value, proj.id, case_id);
            } else if (outs.value.length > 0) {
                db.save_outs(case_id, outs.value);
                if (outs.value.find(msg => msg.kind === 'stop' && msg.catalog === 'system')) {
                    self.clear();
                    db.save();
                }
                let ask = outs.value.find(msg => msg.catalog === 'ask')
                if(ask && self.on_ask) {
                    self.on_ask(ask);
                }
            }
        }, 40);
    }

    async make_env(proj) {
        let env = {
            proj_id: proj.id,
            prots: proj.prots,
            xtras: proj.xtras,
            topos: proj.topos,
            libs: proj.libs
        };
        return await this._xfn('makeenv', env);
    }

    async make_test_env(env) {
        return await this._xfn('makeenv', env);
    }

    async run_test_case(info, db, case_id) {
        let res = await this._xfn('start', info);
        if (res.result === 'ok') {
            this._start_readout(db, case_id, res.value);
        }
        return res;
    }

    async run_case(case_id, db) {
        this.db = db;
        this.case_id = case_id;
        let proj = db.proj;
        let item = proj.luas.find(it => it.id === case_id);
        let info = {
            proj_id: proj.id,
            script: item.script,
            vars: item.vars,
            option: item.option,
            rpath_src: './' + item.name + '.lua',
        }
        let res = await this._xfn('start', info);

        if (res.result === 'ok') {
            this._start_readout(db, case_id, res.value);
        }
        return res;
    }

    async run_stop() {
        return await this._xfn('stop', {
            key: this.run_uuid,
        });
    }

    async run_cmd(cmd, commander) {
        return await this._xfn('command', {
            key: this.run_uuid,
            command: cmd,
            params: commander
        });
    }

    async run_reply(answer) {
        answer.key = this.run_uuid;
        return await this._xfn('reply', answer);
    }
}

export default Runner;