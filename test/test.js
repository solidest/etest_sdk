
const SdkApi = require('../src');

let api = new SdkApi('stbox', 1210);

console.log('-> stop');
api.xfn('stop', null, (res) => {
    console.log('<-', res);
});
console.log('-> state');
api.xfn('state', null, (res) => {
    console.log('<-', res);
});

console.log('-> makeenv');
api.makeenv("test/parsertest", (res) => {
    console.log('<-', res);
});

console.log('-> state');
api.xfn('state', null, (res) => {
    console.log('<-', res);
});

console.log('-> notexit');
api.xfn('notexit', null, (res) => {
    console.log('<-', res);
});

console.log('-> ping');
api.xfn('ping', null, (res) => {
    console.log('<-', res);
});

console.log('-> ping');
api.xfn('ping', null, (res) => {
    console.log('<-', res);
});

console.log('-> pong');
api.xfn('pong', null, (res) => {
    console.log('<-', res);
});

console.log('-> run etl');
api.start('test/parsertest', 'etlTest.etl', ['vars'], {op1: 'ab'}, (res) => {
    console.log('<-', res);

    console.log('key', res.result);
    console.log('-> stop2');
    api.xfn('stop', {key: res.result}, (res) => {
        console.log('<-', res);
    });

    console.log('-> reply2');
    api.xfn('reply', {key: res.result}, (res) => {
        console.log('<-', res);
    });


    console.log('-> command2');
    api.xfn('command', {key: res.result}, (res) => {
        console.log('<-', res);
    });

    console.log('-> readcmd2');
    api.xfn('readcmd', {key: res.result}, (res) => {
        console.log('<-', res);
    });

    setTimeout(()=>{
        console.log('-> run lua');
        api.start('test', 'parsertest/test.lua', ['vars'], {op1: 'ab'}, (res) => {
            console.log('<-run lua', res);
        });
    }, 15000);
    
});

console.log('-> stop');
api.xfn('stop', null, (res) => {
    console.log('<-', res);
});

console.log('-> reply');
api.xfn('reply', null, (res) => {
    console.log('<-', res);
});


console.log('-> command');
api.xfn('command', null, (res) => {
    console.log('<-', res);
});

console.log('-> readcmd');
api.xfn('readcmd', null, (res) => {
    console.log('<-', res);
});




