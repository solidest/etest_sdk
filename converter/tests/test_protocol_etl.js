
const fs = require('fs');
const cv = require('../src');
const prot_data = require('./test_data/protocol.json');
const parser = require('../../parser/src');
const { assert } = require('console');


function etl2prot(etl_file, ast_file) {
    let code = fs.readFileSync(etl_file, {encoding: 'utf-8'});
    let ast = parser.parseEtl(code);
    let prot = cv.protocol_etl2dev(ast[0]);
    fs.writeFileSync(ast_file, JSON.stringify(prot));
}

function prot2etl() {
    let etl1 = cv.protocol_dev2etl(prot_data, 'prot_demo1', '注释内容');
    fs.writeFileSync('./test_out/prot_demo1.etl', etl1);

    let code = fs.readFileSync('./test_out/prot_demo1.etl', {encoding: 'utf-8'});
    let ast = parser.parseEtl(code);
    let prot = cv.protocol_etl2dev(ast[0]);
    let etl2 = cv.protocol_dev2etl(prot, 'prot_demo1');
    assert(etl1 == etl2)
}

etl2prot('./demo/prot_demo1.etl', './test_out/prot_demo1.json')
etl2prot('./demo/prot_demo2.etl', './test_out/prot_demo2.json')
prot2etl() 
