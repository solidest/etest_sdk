
const SdkApi = require('./sdk');

/*
    api: sdk对象
    proj: 项目文件夹路径，与当前目录的相对路径
    entry: 包含entry函数的执行文件，与proj的相对路径
    _vars: 输入给entry的参数值
    _option: 输入给entry的自定义选项
*/

let api = new SdkApi('127.0.0.1', 1210);
let proj = 'test/proj_etl_test';
let entry = 'program/hello_world.lua';
// let entry = 'program/test_api.lua';
// let entry = 'program/demo.lua';
let _vars = {
    var1: "demo_v1",
    var2: 99
};
let _option = null;


//run demo
let run_id = null;
let timer = null;

function exit() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    process.exit(0);
}

function onSended(id, info) {
    console.log('\x1B[90m%s\x1B[39m', id + " -> " + info);
}

function onRecved(id, info) {
    console.log('\x1B[90m%s\x1B[39m', id + " <- " + info);
}

function onPrint(info) {
    console.log('  <- ' + info);
}

function onError(info, id) {
    console.error('\x1B[31m%s\x1B[39m', (id ? id : ' ') + ' <- ' + info);
    // setTimeout(exit, 3000);
}

function onWarn(info) {
    console.error('\x1B[33m%s\x1B[39m', '  <- ' + info);
}

function callback(err, res, id) {
    if (err) {
        return onError(err.message||err, id);
    }
    return onRecved(id, res);
}

//创建环境 proj_path: 项目文件夹路径
function makeEnv(proj_path) {
    let id = api.makeenv(proj_path, callback);
    onSended(id || ' ', 'makeenv');
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
    onSended(id || ' ', 'start');
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
                        case 'entry': {
                            console.log('')
                            onRecved(' ', 'entry > ' + r.value + '\n');
                            break;
                        }

                        case 'exit': {
                            console.log('')
                            onRecved(' ', `exit > ${r.value} (${Math.round(r.time/1000000000)}s)\n`)
                            exit();
                            break;
                        }

                        case 'print': {
                            onPrint(r.value);
                            break;
                        }

                        case 'verifyFail': {
                            onWarn(r.value);
                            break;
                        }
                        case 'assertFail':
                        case 'error': {
                            if (r && r.value) {
                                onError(r.value);
                            } else {
                                onError(JSON.stringify(r));
                            }
                            break;
                        }

                        default:
                            onRecved('?', typeof r == 'object' ? JSON.stringify(r) : r);
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
    onSended(id || ' ', 'state');
} else if (argv == 'stop') {
    let id = api.state((err, res, id) => {
        callback(err, res, id);
        if (res && res != 'idle') {
            id = api.stop(res, (err, res, id) => {
                callback(err, res, id);
                process.exit(0);
            });
            onSended(id || ' ', 'stop');
        } else {
            process.exit(0);
        }
    });
    onSended(id || ' ', 'state');

} else if (argv == 'start') {
    makeEnv(proj);

    startRun(proj, entry, _vars, _option);

    timer = setInterval(readOut, 40);
}