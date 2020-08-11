const path = require('path');
const fs = require('fs');
const shortid = require('shortid');

const protocol = require('./protocol');
const device = require('./device');
const topology = require('./topology');
const helper = require('./helper');

function project_etlenv(idx_cfg) {
    let proj = idx_cfg.project;
    let proj_apath = path.resolve(proj.path);
    let proj_id = proj.id;

    let prots = [];
    let devs = [];
    let topos = [];
    let libs = [];
    let xtra = {};
    
    let asts = helper.parse_proj_etl(proj_apath);
    asts.forEach(ast => {
        if (ast.kind === 'protocol') {
            let obj = protocol.protocol_etl2dev(ast, proj_id, shortid.generate(), '');
            prots.push({name: ast.name, ctx: obj})
        }
    });
    asts.forEach(ast => {
        if (ast.kind === 'device') {
            let obj = device.device_etl2dev(ast, proj_id, shortid.generate(), '');
            devs.push({name: ast.name, ctx: obj});
        }
    });
    asts.forEach(ast => {
        if (ast.kind === 'topology') {
            let obj = topology.topology_etl2dev(ast, proj_id, shortid.generate(), '', devs);
            topos.push({name: ast.name, ctx: obj});
        }
    });

    if(proj.lib_path) {
        let plibs = path.resolve(proj_apath, proj.lib_path);
        let dir = fs.readdirSync(plibs);
        for (let p of dir) {
            if (path.extname(p) !== '.lua') {
                continue;
            }
            libs.push({name: p, ctx: helper.read_text(p, plibs)});
        }
    }
    if(proj.xtra) {
        if(proj.xtra.pack) {
            xtra.pack = helper.read_text(proj.xtra.pack, proj_apath);
        }
        if(proj.xtra.unpack) {
            xtra.unpack = helper.read_text(proj.xtra.unpack, proj_apath);
        }
        if(proj.xtra.check) {
            xtra.check = helper.read_text(proj.xtra.check, proj_apath);
        }
        if(proj.xtra.recvfilter) {
            xtra.recvfilter = helper.read_text(proj.xtra.recvfilter, proj_apath);
        }
    }
    return {
        prots,
        devs,
        topos,
        libs,
        xtra: xtra,
    }
}

function project_devenv(oproj) {
    let prots = oproj.protocol;
    let devs = oproj.device;
    let topos = oproj.topology;
    let libs = oproj.libs;
    let xtra = {};
    if(oproj.xtra) {
        if(oproj.xtra.pack) {
            xtra.pack = oproj.xtra.pack;
        }
        if(proj.xtra.unpack) {
            xtra.unpack = proj.xtra.unpack
        }
        if(proj.xtra.check) {
            xtra.check = proj.xtra.check;
        }
        if(proj.xtra.recvfilter) {
            xtra.recvfilter = proj.xtra.recvfilter;
        }
    }
    return {
        prots,
        devs,
        topos,
        libs,
        xtra,
    }
}

function _append_run(items, all_run) {
    if(!items) {
        return all_run;
    }
    items.forEach(it => {
        if(it)
    })
}

function project_devprogram(tree_items) {
    let all_run = {};
    _append_run(tree_items, all_run);
    return all_run;
}

function project_etlprogram(idx_cfg) {
    let proj = idx_cfg.project;
    let proj_apath = path.resolve(proj.path);
    let all_run = {};

    if(!idx_cfg.program) {
        return all_run;
    }
    for(let k in idx_cfg.program) {
        let r = {};
        let run = idx_cfg.program[k];
        let run_apath = path.resolve(proj_apath, run.src);
        r.path = path.relative(proj_apath, run_apath);
        r.code = helper.read_text(run.src, proj_apath);
        r.vars = run.vars;
        r.option = run.option || {};
        r.option.topology = run.topology;
        all_run[k] = r;
    }
    return all_run;
}

module.exports = {
    project_etlenv,
    project_etlprogram,
    project_devenv,
    project_devprogram,
};