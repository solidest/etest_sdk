
const parser = require('../src/index.js');
// const parser = require('../dist/sdk_parser').parser;

const etl_codes = [
    "protocol prot1 { segment seg1 { parser: 'uint8>=', autovalue: 10 } }", 
    "topology topo1 { }",
    "device topo1 { }",
    "protocol prot1 {\
        segment seg1 {parser: 'uint8', autovalue:0}\
        oneof{\
            when (this.seg1>0 and this.seg1==8) as sub1:\
                segment o1 {parser: 'int8'}\
                segment o2 {parser: 'int8'}\
            when (true) as sub2:\
                segment o1 {parser: 'int8'}\
                segment o2 {parser: 'int8'}\
        }\
    }"
];

const segtype_codes = [
    "uint64<&",
    "int8!>",
    'uint8>=', 
    'string>'
];

const exp_codes = [
    '"abcd"',
    'this.seg1>0 and this.seg1==8',
    '{parser: a, pack: bc}',
];

const block_codes = [
    '<%lua function a() print("a") end %>'
];

function test_parser(fn_name, codes)
{
    let ok = true;
    codes.forEach(code => {
        try {
            let ast = parser[fn_name](code);
            if(!ast) {
                ok = false;
            } 
        } catch (error) {
            console.error('error:', fn_name, error.message);
            ok = false;
        }
    });

    if(ok) {
        console.log('ok:', fn_name);
    }
}

// let ast = parser['parseEtl'](etl_codes[3]);
// console.log(JSON.stringify(ast[0].seglist[1], null, 4));
test_parser('parseEtl', etl_codes);
test_parser('parseSegtype', segtype_codes);
test_parser('parseExp', exp_codes);
test_parser('parseBlock', block_codes);

