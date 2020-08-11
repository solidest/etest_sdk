import helper from '../../helper/helper';

class Project {
    constructor(data) {
        this.data = helper.deep_copy(data);
    }

    get id() {
        return this.data.id;
    }

    get version() {
        return this.data.updated;
    }

    addKind(kind, kind_obj) {
        if (!this[kind]) {
            this[kind] = [];
        }
        this[kind].push(kind_obj);
    }

    make_out() {
        let res = {
            id: this.id,
            name: this.data.name,
            setting: this.data.setting,
            topos: [],
            prots: [],
            xtras: {},
            libs: [],
            luas: [],
            case_tree: []
        }
        if (this.topology) {
            res.topos = this.topology.map(it => it.make_out());
        }
        if (this.protocol) {
            res.prots = this.protocol.map(it => it.make_out());
        }
        if(this.data.xtra) {
            if (this.data.xtra.pack) {
                res.xtras.pack = this.data.xtra.pack;
            }
            if (this.data.xtra.unpack) {
                res.xtras.unpack = this.data.xtra.unpack;
            }
            if (this.data.xtra.check) {
                res.xtras.check = this.data.xtra.check;
            }
            if (this.data.xtra.recvfilter) {
                res.xtras.recvfilter = this.data.xtra.recvfilter;
            }            
        }
        if (this.tree) {
            res.case_tree = this.tree.make_out_tree();
            res.libs = this.tree.make_out_libs();
            res.luas = this.tree.make_out_luas();
        }
        return res;
    }
}

export default Project;