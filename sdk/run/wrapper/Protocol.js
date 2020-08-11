
import helper from '../../helper/helper';
import segparser from '../../../sdk/core/parser/segParser';
import expparser from '../../../sdk/core/parser/expParser';

class Protocol {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    _get_custom_parser(parser) {
        let res = {}
        parser.forEach(prop => {
            res[prop.name] = prop.value.list[0];
        });
        res.type = 'string';
        return res;
    }

    _make_autovalue(seg) {
        let av = '' + (seg.autovalue || '');
        if (!av || !av.trim()) {
            return;
        }
        seg.autovalue = expparser.parse(seg.autovalue);
    }

    _make_arrlen(seg) {
        let len = '' + (seg.arrlen || '');
        if (!len || !len.trim()) {
            return;
        }
        seg.arrlen = expparser.parse(seg.arrlen);
    }

    make_segment(seg) {
   
        let p = seg.parser.trim();
        if (p.startsWith('{')) {
            seg.parser = expparser.parse(seg.parser);
            seg.parser = this._get_custom_parser(seg.parser);
        } else {
            seg.parser = segparser.parse(seg.parser);
        }

        this._make_autovalue(seg);
        this._make_arrlen(seg);

        if (seg.parser.type === 'string' && !seg.parser.pack && !seg.parser.unpack) {
            if (seg.length) {
                seg.length = expparser.parse(seg.length);
            }
            if (seg.endwith && seg.endwith.trim()) {
                seg.endwith = expparser.parse(seg.endwith);
            }
        }
    }

    make_segments(segs) {
        this._make_autovalue(segs);
        this._make_arrlen(segs);
        if (segs.items) {
            segs.items.forEach(seg => this['make_' + seg.kind](seg));
        }
    }

    make_oneof(oneof) {
        if (!oneof.items) {
            return;
        }
        oneof.items.forEach(br => {
            br.condition = expparser.parse(br.condition);
            if (br.items) {
                br.items.forEach(seg => this['make_' + seg.kind](seg));
            }
        });
    }


    make() {
        if (!this.data || !this.data.content || !this.data.content.items) {
            return;
        }
        let items = this.data.content.items;
        items.forEach(seg => this['make_' + seg.kind](seg));
    }

    get_run_oneof(oneof) {
        if (!oneof.items) {
            return [];
        }
        let brs = [];
        oneof.items.forEach(br => {
            let segs = this.get_run_segments(br);
            brs.push({kind: 'oneof', seglist: segs.seglist, exp: br.condition});
        });
        return brs;
    }

    get_run_segment(seg) {
        let res = seg.parser;
        if(!res || typeof res === 'string') {
            return {kind: 'nil'}
        }
        res.kind = res.type;
        delete res.type;
        res.name = seg.name;
        if (seg.autovalue) {
            res.autovalue = seg.autovalue;
        }
        if (seg.arrlen) {
            res.repeated = seg.arrlen;
        }
        if (seg.length) {
            res.length = seg.length;
        }
        if (seg.endwith) {
            res.endwith = seg.endwith;
        }
        return res;
    }

    get_run_segments(segs) {
        let seglist = [];
        let items =segs.items;
        if(items) {
            for(let it of items) {
                this.get_run_seg(seglist, it);
            }
        }
        
        let res = {kind: 'seggroup', name: segs.name, seglist: seglist};
        if (segs.autovalue) {
            res.autovalue = segs.autovalue;
        }
        if (segs.arrlen) {
            res.repeated = segs.arrlen;
        }
        return res;
    }

    get_run_seg(seglist, seg) {
        if(seg.kind === 'segment') {
            seglist.push(this.get_run_segment(seg));
        } else if(seg.kind === 'segments') {
            seglist.push(this.get_run_segments(seg));
        } else if(seg.kind === 'oneof') {
            if(seglist.length>0 && seglist[seglist.length-1].kind === 'oneof') {
                seglist.push({kind: 'nil'})
            }
            let oneofs = this.get_run_oneof(seg);
            if(oneofs.length > 0)
            seglist.push(...oneofs);
        }
    }

    make_out() {
        this.make();

        let seglist = [];
        let items = this.data.content.items;
        for(let it of items) {
            this.get_run_seg(seglist, it);
        }
        return {
            kind: 'protocol',
            name: this.name,
            seglist: seglist,
            bittype: this.data.content.bitalign,
        }
    }
}

export default Protocol;