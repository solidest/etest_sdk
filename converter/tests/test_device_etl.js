
const fs = require('fs');
const cv = require('../src');
const dev_data = require('./test_data/device.json');
const parser = require('../../parser/src');
const { assert } = require('console');

function dev2etl() {
    let etl = cv.device_dev2etl(dev_data, 'dev_demo1', '注释内容');
    fs.writeFileSync('./test_out/dev_demo1.etl', etl);
}

function etl2dev() {
    let code = fs.readFileSync('./test_out/dev_demo1.etl', {encoding: 'utf-8'});
    let ast = parser.parseEtl(code);
    let dev = cv.device_etl2dev(ast[0]);
    fs.writeFileSync('./test_out/dev_demo1.json', JSON.stringify(dev));
}

function check_same() {
    let etl1 = cv.device_dev2etl(dev_data, 'dev_demo1', '注释内容');
    let dev = JSON.parse(fs.readFileSync('./test_out/dev_demo1.json', {encoding: 'utf-8'})).content;
    let etl2 = cv.device_dev2etl(dev, 'dev_demo1', '注释内容');
    assert(etl1===etl2);
}

dev2etl()
etl2dev()
check_same()
