import db from '../../feature/m_db';
import helper from '../../helper/helper';
import CaseLua from './CaseLua';
import t_man from '../../helper/tree_man';

class CaseTree {
    constructor(items, proj) {
        this.items = helper.deep_copy(items);
        this.proj = proj;

        let leafs = [];
        items.forEach(it => {
            t_man.getLeafs(it, leafs);
        });

        this.luas = [];
        this.libs = [];
        leafs.forEach(it => {
            if (it.kind === 'lua') {
                let doc = db.load('doc', it.id);
                let cl = new CaseLua(doc, proj, it.name);
                if (doc.content && doc.content.option && doc.content.option.lib) {
                    this.libs.push(cl);
                } else {
                    this.luas.push(cl);
                }
            }
        });
    }

    _make_clear_items() {
        let res = [];
        if (!this.items) {
            return res;
        }
        let root = {
            children: this.items,
            id: 'root'
        };
        this.libs.forEach(it => {
            let p = t_man.findParent(root, it.id);
            let idx = p.children.findIndex(i => i.id === it.id);
            p.children.splice(idx, 1);
        });
    }

    make_out_tree() {
        this._make_clear_items();
        return this.items;
    }

    make_out_luas() {
        return this.luas.map(it => {
            return it.make_out()
        });
    }

    make_out_libs() {
        return this.libs.map(it => {
            let res = it.make_out();
            return {
                file: res.name + '.lua',
                code: res.script,
            }
        });
    }
}

export default CaseTree;