const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const loki = require('lokijs');
const { assert } = require('console');
const project = require('../project');
const helper = require('../helper');

function test_etl_proj(idx_obj) {
    let env = project.project_etlenv(idx_obj);
    let program = project.project_etlprogram(idx_obj);
    assert(env && program);
}

function test_dev_proj(oproj) {
    let env = project.project_devenv(oproj);
    let program = project.project_devprogram(oproj.program.items);
    assert(env && program);

}

function deleteFolderRecursive(url) {
    var files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function (file, index) {
            var curPath = path.join(url, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    } else {
        console.log("给定的路径不存在，请给出正确的路径");
    }
}

function load_projs(db) {
    let projs = db.getCollection('project').find();
    let res = [];
    projs.forEach(proj => {
        let db_proj = {};
        let proj_id = proj.id;
        db_proj.project = proj;
        ['protocol', 'device', 'topology', 'panel'].forEach(kind => {
            let items = db.getCollection(kind).find({'proj_id': { '$eq' : proj_id }});
            let objs = [];
            items.forEach(it => {
                let doc = db.getCollection('doc').findOne({'id': { '$eq' : it.id }});
                if(doc) {
                    objs.push({name: it.name, ctx: doc}); 
                }
            });
            db_proj[kind] = objs;
        });
        db_proj.program = db.getCollection('program').findOne({'id': { '$eq' : proj.id }});
        res.push(db_proj);
    });
    return res;
}


const out_apath1 = path.resolve('./demo_out1');
const out_apath2 = path.resolve('./demo_out2');
deleteFolderRecursive(out_apath1);
deleteFolderRecursive(out_apath2);
fs.mkdirSync(out_apath1)
fs.mkdirSync(out_apath2)
const idx_obj = yaml.safeLoad(helper.read_text('index.yml', './'));

let db = new loki('demo_db/db1.json', {
    autoload: true,
    autoloadCallback: start_test,
});


function start_test () {
    test_etl_proj(idx_obj);
    let projs = load_projs(db);
    projs.forEach(op => {
        test_dev_proj(op);
    });
    console.log('test passed')
}
