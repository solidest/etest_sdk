const path = require('path');
const fs = require('fs');
const parser = require("../parser");

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

function _parse_etl(files, proj_apath) {
    let asts = [];
    for (let f of files) {
        let text = fs.readFileSync(f, "utf8");
        let ast = parser.parseEtl(text);
        if (ast) {
            for (let a of ast) {
                a.src = path.relative(proj_apath, f);
            }
            asts = asts.concat(ast);
        }
    }
    return asts;
}

function read_text(file, proj_apath) {
    let f = path.resolve(proj_apath, file);
    if (fs.existsSync(f)) {
        return fs.readFileSync(f, 'utf8');
    }
    throw new Error(`文件 ${f} 未找到`);
}

function is_array(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

function parse_proj_etl(proj_apath) {
    let files = [];
    _get_etl_files(proj_apath, files);
    return _parse_etl(files, proj_apath);
}

function set_etl_props(obj, props) {
    if (!props) {
        return;
    }
    props.forEach(prop => {
        let v = exp2str(prop.value, true);
        if((prop.name === 'autovalue' && prop.value && prop.value.kind==='string') || (prop.name === 'endwith')) {
            obj[prop.name] = `'${v}'`;
        } else if(prop.name === 'parser' && prop.value && is_array(prop.value)) {
            let res = [];
            let pack = prop.value.find(it => it.name === 'pack');
            if(pack && pack.value && pack.value.kind === 'pid') {
                res.push(`pack: ${pack.value.list[0]}`);
            }
            let unpack = prop.value.find(it => it.name === 'unpack');
            if(unpack && unpack.value && unpack.value.kind === 'pid') {
                res.push(`unpack: ${unpack.value.list[0]}`);
            }
            obj.parser = `{ ${res.join(', ')} }`;
        } else {
            obj[prop.name] = v;
        }
    })
}

function exp2str(exp, is_top) {
    if (!exp) {
        return '';
    }
    switch (exp.kind) {
        case 'bool':
        case 'number':
            return exp.value;
        case 'string': {
            let res = exp.value.replace('\0', '\\0');
            return res;
        }
        case 'uminus': {
            if (exp.exp && exp.exp.kind === 'number') {
                return `-${exp.exp.value}`;
            } else {
                return is_top ? `-${exp2str(exp.exp)}` : `(-${exp2str(exp.exp)})`;
            }
        }
        case 'pid': {
            if (exp.list) {
                return exp.list.join('.');
            } else {
                return '';
            }
        }
        case 'array': {
            let arr = [];
            if (!exp.list) {
                return arr;
            }
            exp.list.forEach(it => {
                arr.push(exp2str(it));
            });
            return arr;
        }
        case 'not':
            return is_top ? `not ${exp2str(exp.exp)}` : `(not ${exp2str(exp.exp)})`;
        case 'bool':
        case 'number':
            return exp.value;
        case 'pid':
            return exp.list.join('.');
        case 'eq_eq': {
            return is_top ? `${exp2str(exp.left)} == ${exp2str(exp.right)}` : `(${exp2str(exp.left)} == ${exp2str(exp.right)})`;
        }
        case 'not_eq': {
            return is_top ? `${exp2str(exp.left)} ~= ${exp2str(exp.right)}` : `(${exp2str(exp.left)} ~= ${exp2str(exp.right)})`;
        }
        case 'gt': {
            return is_top ? `${exp2str(exp.left)} > ${exp2str(exp.right)}` : `(${exp2str(exp.left)} > ${exp2str(exp.right)})`;
        }
        case 'lt': {
            return is_top ? `${exp2str(exp.left)} < ${exp2str(exp.right)}` : `(${exp2str(exp.left)} < ${exp2str(exp.right)})`;
        }
        case 'gt_eq': {
            return is_top ? `${exp2str(exp.left)} >= ${exp2str(exp.right)}` : `(${exp2str(exp.left)} >= ${exp2str(exp.right)})`;
        }
        case 'lt_eq': {
            return is_top ? `${exp2str(exp.left)} <= ${exp2str(exp.right)}` : `(${exp2str(exp.left)} <= ${exp2str(exp.right)})`;
        }
        case 'add': {
            return is_top ? `${exp2str(exp.left)} + ${exp2str(exp.right)}` : `(${exp2str(exp.left)} + ${exp2str(exp.right)})`;
        }
        case 'subtract': {
            return is_top ? `${exp2str(exp.left)} - ${exp2str(exp.right)}` : `(${exp2str(exp.left)} - ${exp2str(exp.right)})`;
        }
        case 'multiply': {
            return is_top ? `${exp2str(exp.left)} * ${exp2str(exp.right)}` : `(${exp2str(exp.left)} * ${exp2str(exp.right)})`;
        }
        case 'divide': {
            return is_top ? `${exp2str(exp.left)} / ${exp2str(exp.right)}` : `(${exp2str(exp.left)} / ${exp2str(exp.right)})`;
        }
        case 'and': {
            return is_top ? `${exp2str(exp.left)} and ${exp2str(exp.right)}` : `(${exp2str(exp.left)} and ${exp2str(exp.right)})`;
        }
        case 'or': {
            return is_top ? `${exp2str(exp.left)} or ${exp2str(exp.right)}` : `(${exp2str(exp.left)} or ${exp2str(exp.right)})`;
        }
        case 'CheckCode':
        case 'ByteSize': {
            let ps = [];
            exp.params.forEach(p => {
                let v = exp2str(p, true);
                if (is_array(v)) {
                    v = `[${v.join(', ')}]`;
                }
                ps.push(v);
            })
            return (`${exp.kind}(${ps.join(', ')})`)
        }
        default:
            if (is_array(exp)) {
                let o = {};
                set_etl_props(o, exp);
                return o;
            } else {
                console.error('unknow exp:', exp.kind);
            }
            break;
    }
}

function prop2str(obj, key) {
    let value = obj[key];
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return `${key}: '${value}',`;
}

function prop2raw(obj, key) {
    let value = obj[key];
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return `${key}: ${value},`;
}

function append_codes_arr(codes, level, arr) {
    if(!arr) {
        return;
    }
    for(let v of arr) {
        let t = typeof v;
        switch (t) {
            case 'string':
                codes.push({level: level, code: `'${v}',`})
                break;
            case 'boolean':
            case 'number':
                codes.push({level: level, code: `${v},`})
                break;
            case 'object':{
                if(is_array(v)) {
                    codes.push({level: level, code: `[`});
                    append_codes_arr(codes, level+1, v);
                    codes.push({level: level, code: '],'});
                } else {
                    append_codes_obj(codes, level, v);
                }
                break;
            }
            default:
                console.error('unkonw type:', t);
                break;
        }
    }
}

function append_codes_obj(codes, level, value, key) {
    if (!value) {
        return;
    }
    codes.push({level: level, code: key ? `${key}: {`: '{'});
    for(let k in value) {
        let v = value[k];
        let t = typeof value[k];
        switch (t) {
            case 'string':
                codes.push({level: level + 1, code: `${k}: '${v}',`})
                break;
            case 'boolean':
            case 'number':
                codes.push({level: level + 1, code: `${k}: ${v},`})
                break;
            case 'object':{
                if(is_array(v)) {
                    codes.push({level: level+1, code: `${k}: [`});
                    append_codes_arr(codes, level+2, v);
                    codes.push({level: level+1, code: '],'});
                } else {
                    append_codes_obj(codes, level+1, value, k);
                }
                break;
            }
            default:
                console.error('unkonw type:', t);
                break;
        }
    }
    codes.push({level: level, code: '},'});
}

module.exports = {
    read_text,
    parse_proj_etl,
    set_etl_props,
    is_array,
    exp2str,
    prop2str,
    prop2raw,
    append_codes_obj,
    append_codes_arr,
};