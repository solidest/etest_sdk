
const shortid = require("shortid");
const KIND = 'topology';


function _fill_devs(devs, item) {
    if(!item.value||item.value.length===0) {
        return;
    }
    item.value.forEach(name =>{
        devs.push({
            kind: item.kind,
            name: name
        })
    })
}

function _fill_binds(binds, item) {
    binds.push({
        bind_id: item.bind,
        dev: {name: item.device},
        conn: {name: item.connector},
    })
}

function _fill_links(topo, item) {
    if(!item.value) {
        return;
    }
    let len = item.value.length;
    if(len===2) {
        topo.pp_links.push({
            id: item.name,
            name: item.name,
            dc1: {
                dev: {name: item.value[0].device},
                conn: {name: item.value[0].connector}
            },
            dc2: {
                dev: {name: item.value[1].device},
                conn: {name: item.value[1].connector}
            }
        });
    } else if(len>2) {
        let bus_id = shortid.generate();
        topo.buses.push({
            id: bus_id
        });
        item.value.forEach(it => {
            topo.bus_links.push({
                id: item.name,
                name: item.name,
                bus_id: bus_id,
                dc: {
                    dev: {name: it.device},
                    conn: {name: it.connector}
                }
            });
        })
    }
}

function topology_etl2dev(ast) {
    let topo = {
        devs: [],
        buses: [],
        binds: [],
        bus_links: [],
        pp_links: [],
    };
    if(!ast.value) {
        return {
            kind: KIND,
            name: ast.name,
            content: topo
        };
    }
    if(ast.value) {
        ast.value.forEach(item => {
            switch (item.kind) {
                case 'linking':
                    _fill_links(topo, item);
                    break;
                case 'uut':
                case 'etest':
                case 'simu':
                    _fill_devs(topo.devs, item);
                    break;
                case 'binding':
                    _fill_binds(topo.binds, item);
                    break;
            }
        });
    }
    return {
        kind: KIND,
        name: ast.name,
        content: topo
    };;
}


function _append_code(codes, level, code) {
    if(code === undefined || code === null) {
        return;
    }
    codes.push({
        level: level,
        code: code
    });
}

function _get_dc_name(dc) {
    return `${dc.dev.name}.${dc.conn.name||'_'}`;
}

function _append_code_mapping(codes, level, devs) {
    if(!devs) {
        return;
    }
    
    _append_code(codes, level, 'mapping: {');
    let items = devs.filter(d => d.kind === 'uut');
    if(items.length>0) {
        let names = items.map(it=>it.name);
        _append_code(codes, level+1, `uut: [${names.join(', ')}],`);
    }

    items = devs.filter(d => d.kind === 'etest');
    if(items.length>0) {
        let names = items.map(it=>it.name);
        _append_code(codes, level+1, `etest: [${names.join(', ')}],`);
    }

    items = devs.filter(d => d.kind === 'simu');
    if(items.length>0) {
        let names = items.map(it=>it.name);
        _append_code(codes, level+1, `simu: [${names.join(', ')}],`);
    }

    _append_code(codes, level, '}');
}

function _append_code_linking(codes, level, pplinks, buslinks) {
    _append_code(codes, level, 'linking: {');
    if(pplinks) {
        pplinks.forEach(link => {
            _append_code(codes, level+1, `${link.name} : [${_get_dc_name(link.dc1)}, ${_get_dc_name(link.dc2)}], `);
        })
    }
    if(buslinks) {
        let bus_ids = [];
        buslinks.forEach(link => {
            if(!bus_ids.includes(link.bus_id)) {
                bus_ids.push(link.bus_id);
                let ls = buslinks.filter(l => l.bus_id === link.bus_id);
                if(ls.length>1) {
                    conns = ls.map(l => _get_dc_name(l.dc));
                    _append_code(codes, level+1, `${link.name} : [${conns.join(', ')}], `);
                }
            }
        })
    }
    _append_code(codes, level, '}');
}

function _append_code_binding(codes, level, binds) {
    if(!binds) {
        return;
    }

    _append_code(codes, level, 'binding: {');
    binds.forEach(bind => {
        _append_code(codes, level+1, `${_get_dc_name(bind)}: '${bind.bind_id}',`)
    });
    _append_code(codes, level, '}');
}


function topology_dev2etl(content, name, memo) {
    content = content || {};
    let codes = [];
    if (memo) {
        _append_code(codes, 0, `// ${memo}`);
    }
    _append_code(codes, 0, `topology ${name} {`);
    _append_code_mapping(codes, 1, content.devs);
    _append_code_linking(codes, 1, content.pp_links, content.bus_links);
    _append_code_binding(codes, 1, content.binds);

    _append_code(codes, 0, '}');
    let texts = codes.map(it => `${'\t'.repeat(it.level)}${it.code}`);
    return texts.join('\n');
}

module.exports = {
    topology_etl2dev,
    topology_dev2etl,
};