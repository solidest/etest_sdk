const driver = require('.');
const assert = require('assert');

const ip = 'etest';
const port = 1210;

async function test_open_close() {
    let res = await driver.open(ip, 111);
    assert(res.result !== 'ok');
    res = await driver.open('11.88.9', port);
    assert(res.result !== 'ok');
    res = await driver.open(ip, port);
    assert(res.result === 'ok');
    assert(driver.is_open())
    driver.close();
    res = await driver.open(ip, port);
    assert(res.result === 'ok');
}


async function test_ping() {
    let res = await driver.ping(ip, port);
    assert(res.result === 'ok' && res.value === 'pong');
    driver.close();
    res = await driver.ping(ip, port);
    assert(res.result === 'ok' && res.value === 'pong');
}

async function test_all() {
    await test_open_close();
    await test_ping();
}

function on_error(err) {
    console.log(err)
}

driver.on_error(on_error);

test_all();
