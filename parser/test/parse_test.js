
const parser = require('../src/index.js');

const etl_codes = [
    "protocol prot1 { segment seg1 { parser: 'uint8>=', autovalue: 10 } }", 
    "topology topo1 { }",
    "device topo1 { }",
];

const segtype_codes = [
    "uint64<&",
    "int8!>",
    'uint8>=', 
    'string>'
];

const exp_codes = [
    '"abcd"',
    '1+2*this.seg5',
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


test_parser('parseEtl', etl_codes);
test_parser('parseSegtype', segtype_codes);
test_parser('parseExp', exp_codes);
test_parser('parseBlock', block_codes);

