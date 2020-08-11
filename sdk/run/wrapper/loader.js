

import db from '../../feature/m_db';
import Project from './Project';
import Device from './Device';
import Topology from './Topology';
import Protocol from './Protocol';
import CaseTree from './CaseTree';

function append_kind(proj, kind, cls) {
    let list = db.list(kind, proj.id);
    if(!list) {
        return;
    }
    list.forEach(it =>{
        let doc = db.load('doc', it.id);
        if(doc) {
            proj.addKind(kind, new cls(doc, proj, it.name));
        }
    } );
}

function append_program(proj) {
    let pg_doc = db.load('program', proj.id);
    if(!pg_doc) {
        return;
    }
    let items = pg_doc.items || [];
    proj.tree = new CaseTree(items, proj);
}

function load_proj(proj_id) {
    let proj = new Project(db.load_proj(proj_id));
    append_kind(proj, 'device', Device);
    append_kind(proj, 'topology', Topology);
    append_kind(proj, 'protocol', Protocol);
    append_program(proj);

    return proj.make_out();
}

export default load_proj;