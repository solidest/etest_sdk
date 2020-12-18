
const {sdk} = require('./include/sdk');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const ferr = chalk.bold.red;
const fwar = chalk.keyword('orange');
const fok = chalk.green;
const finfo = chalk.blueBright;
const fcode = chalk.cyanBright;
const fign = chalk.blackBright;

function parse(file_etl, out_path, display)
{
    if (!fs.existsSync(file_etl)) {
        console.log(ferr('文件"%s"不存在'), file_etl);
        return;
    }
    try {
        let txt = fs.readFileSync(file_etl, 'utf8');
        let ast = sdk.parser.parse_etl(txt);
        let outo = null;
        switch(ast[0].kind) {
            case 'protocol': {
                let oprot = sdk.converter.protocol_etl2dev(ast[0]);
                outo = sdk.converter.makeout_protocol(oprot);
            }
            break;
            case 'topology': {

            }
            break;
        }
        if(!outo) {
            throw new Error('生成失败');
        }
        let outf = path.join(out_path || path.dirname(file_etl), path.basename(file_etl, '.etl') + '_out.json');
        let str = JSON.stringify(outo, null, 4)
        fs.writeFileSync(outf, str);
        console.log(fok('生成成功，结果输出至：%s'), path.resolve(outf));
        if(display) {
            console.log(fcode(str));
        }
    } catch (error) {
        console.log(ferr(error.message));
    }
}


module.exports = {
    parse
};



// const etl_codes = [
//     "protocol prot1 { segment seg1 { parser: 'uint8>=', autovalue: 10 } }", 
//     "topology topo1 { }",
//     "device topo1 { }",
// ];

// const segtype_codes = [
//     "uint64<&",
//     "int8!>",
//     'uint8>=', 
//     'string>'
// ];

// const exp_codes = [
//     '"abcd"',
//     '1+2*this.seg5',
//     '{parser: a, pack: bc}',
// ];

// const block_codes = [
//     '<%lua function a() print("a") end %>'
// ];

// function test_parser(fn_name, codes)
// {
//     let ok = true;
//     codes.forEach(code => {
//         try {
//             let ast = parser[fn_name](code);
//             if(!ast) {
//                 ok = false;
//             }
//         } catch (error) {
//             console.error('error:', fn_name, error.message);
//             ok = false;
//         }
//     });

//     if(ok) {
//         console.log('ok:', fn_name);
//     }
// }


// test_parser('parseEtl', etl_codes);
// test_parser('parseSegtype', segtype_codes);
// test_parser('parseExp', exp_codes);
// test_parser('parseBlock', block_codes);