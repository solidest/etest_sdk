const path = require('path');
const fs = require('fs');
const shortid = require('shortid');

const protocol = require('./protocol');
const device = require('./device');
const topology = require('./topology');
const helper = require('./helper');

const MKPprotocol = require('./make/Protocol');
const MKDevice = require('./make/Device');
const MKTopology = require('./make/Topology');
const { assert } = require('console');


function _project_etlenv(idx_cfg) {
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

function _project_devenv(oproj) {
    let prots = oproj.protocol||[];
    let devs = oproj.device||[];
    let topos = oproj.topology||[];
    let libs = oproj.libs||[];
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

function _makeout_topos(devs, topos) {
    let odevs = devs.map(dev=>new MKDevice(dev.ctx, dev.name));
    let otopos = topos.map(topo => new MKTopology(topo.ctx, topo.name, odevs));
    return otopos.map(otopo => otopo.make_out());
}

function _makeout_env(oenv) {
    let s1 = JSON.stringify(oenv);
    let res = {
        xtra: oenv.xtra,
        libs: oenv.libs.map(it => {
            return {
                file: it.name,
                code: it.ctx,
            }
        }),
        prots: oenv.prots.map(it => {
            let mk = new MKPprotocol(it.ctx, it.name);
            return mk.make_out();
        }),
        topos: _makeout_topos(oenv.devs, oenv.topos),
    }
    let s2 = JSON.stringify(oenv);
    assert(s1 === s2, 'changed')
    return res;
}

function makeout_etl2env(idx_cfg) {
    try {
        let oenv = _project_etlenv(idx_cfg);
        return _makeout_env(oenv);        
    } catch (error) {
        console.error(error.message, error.stack);
    }
}

function makeout_dev2env(oproj) {
    try {
        let oenv = _project_devenv(oproj);
        return _makeout_env(oenv);
    } catch (error) {
        console.error(error.message, error.stack);
    }

}


module.exports = {
    makeout_etl2env,
    makeout_dev2env,
};