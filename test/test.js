
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

console.log('-> state');
api.xfn('state', null, (res) => {
    console.log('<-', res);
});

console.log('-> out');
api.xfn('out', null, (res) => {
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

console.log('-> run pong');
api.start('test/parsertest', 'etlTest.etl', null, null, (res) => {
    console.log('<-', res);
})


