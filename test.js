
const SdkApi = require('./sdk');

let api = new SdkApi('stbox', 1210);
let proj = 'test/proj_protocol_test';
let entry = 'program/test1.lua';


let run_id = null;
let timer = null;
function onSended(id, info) {
    console.log(id+"->", info);
}

function onRecved(id, info) {
    console.log(id+"<-", info);
}

function onError(id, info) {
    console.log(id+"ERR>", info);
    if(timer) {
        clearInterval(timer);
        timer = null;
    }
    process.exit(0);
}

function callback(err, res, id) {
    if(err) {
        return onError(id, err);
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
        if(res) {
            run_id = res;
        }
    });
    onSended(id, 'start');
}

//读取执行输出
function readOut() {
    if(!run_id) {
        return;
    }
    api.readout(run_id, (err, res, id)=>{
        if(err) {
            onError(id, err);
            return;
        }
        if(res && res.catalog) {
            onRecved(' ', res);
            if(res.catalog=='system' && res.kind=='exit') {
                process.exit(0);
            }
        }
    });
}

let argv = process.argv[process.argv.length-1];

if(argv == 'state') {
    let id = api.state((err, res, id)=>{
        callback(err, res, id);
        process.exit(0);
    });
    onSended(id, 'state');
} else if(argv=='stop') {
    let id = api.state((err, res, id)=>{
        callback(err, res, id);
        if(res && res!='idle') {
            id = api.stop(res, (err, res, id)=>{
                callback(err, res, id);
                process.exit(0);
            });
            onSended(id, 'stop');
        } else {
            process.exit(0);
        }
    });
    onSended(id, 'state');
    
} else {
    makeEnv(proj);
    startRun(proj, entry, null, null);
    timer = setInterval(readOut, 40);   
}







