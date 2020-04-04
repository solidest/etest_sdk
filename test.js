const SdkApi = require('./sdk');

let api = new SdkApi('stbox', 1210);
let proj = 'test/proj_protocol_test';
let entry = 'program/test1.lua';

let run_id = null;
let timer = null;

function onSended(id, info) {
    console.log(id + " ->", info);
}

function onRecved(id, info) {
    console.log(id + " <-", info);
}

function onError(id, info) {
    console.error('\x1B[31m%s\x1B[39m', id + " <- " + info);
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    process.exit(0);
}

function callback(err, res, id) {
    if (err) {
        return onError(id, err.message ? err.message : err);
    }
    return onRecved(id, res);
}

//创建环境 proj_path: 项目文件夹路径
function makeEnv(proj_path) {
    let id = api.makeenv(proj_path, callback);
    onSended(id, 'makeenv');
}

//执行测试 proj_path: 项目文件夹路径，run_file: 执行入口文件, vars: 输入参数取值, option: 自定义选项
function startRun(proj_path, run_file, vars, option) {
    run_id = null;
    let id = api.start(proj_path, run_file, vars, option, (err, res, id) => {
        callback(err, res, id);
        if (res) {
            run_id = res;
        }
    });
    onSended(id, 'start');
}

//读取执行输出
function readOut() {
    if (!run_id) {
        return;
    }
    api.readout(run_id, (err, res, id) => {
        if (err) {
            onError(id, err);
            return;
        }

        if (res && res.length > 0) {
            for (let r of res) {
                if (r.catalog === 'system') {
                    switch (r.kind) {
                        case 'exit': {
                            setTimeout(() => {
                                process.exit(0);
                            }, 1000);
                            break;
                        }

                        case 'print': {
                            onRecved(' ', r.value);
                            break;
                        }

                        case 'error': {
                            onError(' ', r.value);
                            break;
                        }

                        default:
                            onRecved('?', r);
                            break;
                    }
                } else {
                    onRecved('?', r);
                }
            }
        }
    });
}

let argv = process.argv[process.argv.length - 1];

if (argv == 'state') {
    let id = api.state((err, res, id) => {
        callback(err, res, id);
        process.exit(0);
    });
    onSended(id, 'state');
} else if (argv == 'stop') {
    let id = api.state((err, res, id) => {
        callback(err, res, id);
        if (res && res != 'idle') {
            id = api.stop(res, (err, res, id) => {
                callback(err, res, id);
                process.exit(0);
            });
            onSended(id, 'stop');
        } else {
            process.exit(0);
        }
    });
    onSended(id, 'state');

} else if (argv == 'start') {
    makeEnv(proj);

    startRun(proj, entry, {
        var1: "demo_v1"
    }, /*{op1: "demo_op1"}*/ null);
    
    timer = setInterval(readOut, 40);
}