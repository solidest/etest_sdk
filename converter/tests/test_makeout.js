
const fs = require('fs');
const cv = require('../src');
const parser = require('../../parser/src');

// function test_demo()
// {
//     let txt = fs.readFileSync('./err.json', 'utf8');
//     let oprot = JSON.parse(txt);
//     let out = cv.makeout_protocol(oprot);
//     console.log('out', JSON.stringify(out, null, 4))
// }

function makeout_protocol(etl_file, out_file)
{
    let code = fs.readFileSync(etl_file, {encoding: 'utf-8'});
    let ast = parser.parseEtl(code);
    let oprot = cv.protocol_etl2dev(ast[0]);
    let out = cv.makeout_protocol(oprot);
    fs.writeFileSync(out_file, JSON.stringify(out));
}


makeout_protocol('./demo/prot_demo1.etl', './test_out/prot_make1.json')
makeout_protocol('./demo/prot_demo2.etl', './test_out/prot_make2.json')

// test_demo()