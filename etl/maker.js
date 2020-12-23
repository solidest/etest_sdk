
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

function _get_etl_files(pf, results) {
    if (!fs.existsSync(pf)) {
        return;
    }

    let st = fs.statSync(pf);
    if (st.isFile()) {
        if (path.extname(pf) !== '.etl') {
            return;
        }
        results.push(pf);
        return;
    }

    if (st.isDirectory()) {
        let dir = fs.readdirSync(pf);
        for (let p of dir) {
            _get_etl_files(path.join(pf, p), results);
        }
    }
}


function makeprot(file_etl, out_path, display)
{
    let etls = [];
    _get_etl_files(file_etl, etls);
    if (etls.length === 0) {
        console.log(ferr('"%s"中未找到ETL文件'), file_etl);
        return;
    }

    let res = [];
    try {
        for(let f of etls) {
            let txt = fs.readFileSync(f, 'utf8');
            let asts = sdk.parser.parse_etl(txt);
            for(let ast of asts) {
                if(ast.kind !== 'protocol') {
                    continue;
                }
                let oprot = sdk.converter.protocol_etl2dev(ast);
                fs.writeFileSync('err.json', JSON.stringify(oprot));
                let outo = sdk.converter.makeout_protocol(oprot);
                res.push(outo);
            }
        }
        if(res.length === 0) {
            throw new Error('生成失败，没有解析到ETL协议代码');
        }
        
        let outf = path.join(out_path || path.dirname(file_etl), path.basename(file_etl, '.etl') + '_out.json');
        let str = JSON.stringify(res, null, 4)
        fs.writeFileSync(outf, str);
        console.log(fok('生成%s项协议，结果输出至：%s'), res.length, path.resolve(outf));
        if(display) {
            console.log(fcode(str));
        }        
    } catch (error) {
        console.log(ferr(error.message));
    }
}

module.exports = {
    makeprot,

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