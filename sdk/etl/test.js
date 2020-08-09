const path = require('path');
const helper = require('./helper');
const fs = require('fs');
const etl_dev = require('./etl_dev_protocol');
const shortid = require('shortid');
const { assert } = require('console');

function test_etl2dev(proj_apath, out_apath) {
    let asts = helper.parse_proj_etl(proj_apath);
    let proj_id = shortid.generate();
    asts.forEach(ast => {
        fs.writeFileSync(path.resolve(out_apath, ast.name + '_ast.json'), JSON.stringify(ast, null, 4));
        let obj;
        switch (ast.kind) {
            case 'protocol':
                obj = etl_dev.protocol_etl2dev(ast, proj_id, shortid.generate(), 'memo text');
                break;
        
            default:
                break;
        }
        fs.writeFileSync(path.resolve(out_apath, ast.name + '_db.json'), JSON.stringify(obj, null, 4));
    });

}

function test_protocol_dev2etl(db_path, out_apath) {
    const prot = require(path.resolve(db_path, 'prot_demo_db.json'));
    prot.content.memo = '说明文本';
    let code = etl_dev.protocol_dev2etl(prot, 'prot_demo');
    fs.writeFileSync(path.resolve(out_apath, 'prot_demo_out.etl'), code);
}

function test_result(path1, path2) {
    let code1 = fs.readFileSync(path.resolve(path1, 'prot_demo_out.etl'), 'utf8');
    let code2 = fs.readFileSync(path.resolve(path2, 'prot_demo_out.etl'), 'utf8');
    assert(code1 === code2);
    console.log('test passed')
}

const demo_apath = path.resolve('./demo');
const out_apath1 = path.resolve('./demo_out1');
const out_apath2 = path.resolve('./demo_out2');

test_etl2dev(demo_apath, out_apath1);
test_protocol_dev2etl(out_apath1, out_apath1);

test_etl2dev(out_apath1, out_apath2);
test_protocol_dev2etl(out_apath2, out_apath2);

test_result(out_apath1, out_apath2);





