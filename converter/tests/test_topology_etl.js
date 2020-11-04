
const fs = require('fs');
const cv = require('../src');
const topo_data = require('./test_data/topology.json');
const parser = require('../../parser/src');
const { assert } = require('console');

function topo2etl() {
    let etl = cv.topology_dev2etl(topo_data, 'topo_demo1', '注释内容');
    fs.writeFileSync('./test_out/topo_demo1.etl', etl);
}

function etl2topo() {
    let code = fs.readFileSync('./test_out/topo_demo1.etl', {encoding: 'utf-8'});
    let ast = parser.parseEtl(code);
    let topo = cv.topology_etl2dev(ast[0]);
    fs.writeFileSync('./test_out/topo_demo1.json', JSON.stringify(topo));
}

function check_same() {
    let etl1 = cv.topology_dev2etl(topo_data, 'topo_demo1', '注释内容');
    let topo = JSON.parse(fs.readFileSync('./test_out/topo_demo1.json', {encoding: 'utf-8'})).content;
    let etl2 = cv.topology_dev2etl(topo, 'topo_demo1', '注释内容');
    assert(etl1===etl2);
}

topo2etl()
etl2topo()
check_same()
