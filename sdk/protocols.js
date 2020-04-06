
const path = require("path");
const fs = require("fs");
const parser = require("./parser/etxParser")
const segparser = require("./parser/segParser")

//获取目录下所有的etl文件
function getEtls(pf, results) {
    if(!fs.existsSync(pf)) {
        return;
    }

    let st = fs.statSync(pf);
    if(st.isFile()) {
        if(path.extname(pf)!=='.etl') {
            return;
        }
        results.push(pf);
        return;
    }

    if(st.isDirectory()) {
        let dir = fs.readdirSync(pf);
        for(let p of dir) {
            getEtls(path.join(pf, p), results);
        }        
    }
}

//分析解析器字符串
function getStrSegType(seg, pser, vp, file) {
    try {
        let ast = segparser.parse(vp);
        seg.seg_type = ast.type;
        if(ast.bitcount) {
            seg.bitcount = ast.bitcount;
            seg.signed = ast.signed;
        }
        if(ast.encode) {
            seg.encode = ast.encode;
        }
        if(ast.order) {
            seg.order = ast.order;
        }
    } catch (error) {
        throw new Error(`"parser"属性值“${vp}”解析失败(${file} : ${pser.value_line||''})`)
    }
    return;
}

//分析自定义解析器
function getArrSegType(seg, pser, props, file) {
    let pack = props.find(it=>it.name==='pack');
    if(pack) {
        let v = pack.value;
        if(v.kind==='pid' && v.list.length===1 && v.list[0]) {
            seg.pack = v.list[0];
        } else {
            console.log(v)
            throw new Error(`"pack"属性设置错误(${file} : ${pack.value_line||''})`);
        }
    }

    let unpack = props.find(it=>it.name==='unpack');
    if(unpack) {
        let v = unpack.value;
        if(v.kind==='pid' && v.list.length===1 && v.list[0]) {
            seg.unpack = v.list[0];
        } else {
            console.log(v)
            throw new Error(`"unpack"属性设置错误(${file} : ${unpack.value_line||''})`);
        }
    }

    if(!seg.pack && !seg.unpack) {
        throw new Error(`"parser"属性设置错误(${file} : ${pser.value_line||''})`);
    }
    seg.seg_type = "string";

    return;
}

const _props_nams = [
    'parser',
    'repeated',
    'autovalue'
];

//检查属性名称是否都在有效范围内
function checkSegProps(props, file) {
    for(let p of props) {
        if(!_props_nams.includes(p.name)) {
            throw new Error(`无法识别的属性"${p.name}" (${file} : ${p.name_line||''})`)
        }
    }
}

//解析一个实体字段的解析器类型
function parseSegType(file, seg) {
    if(seg.kind==="segment") {
        if(!seg.props || seg.props.length===0) {
            seg.seg_type = "nil";
            return;
        }

        checkSegProps(seg.props, file);

        let pser = seg.props.find(it=>it.name==='parser');
        if(!pser) {
            throw new Error(`"parser"属性未设置(${file} : ${pser.value_line||''})`);
        }


        if(pser.value.kind === 'string') {
            return getStrSegType(seg, pser, pser.value.value, file);
        } else if(pser.value instanceof Array) {
            return getArrSegType(seg, pser, pser.value, file);
        } else {
            console.log('ERR parser.kind', typeof pser.value, pser)
        }

    } else if(seg.kind==='protocol' || seg.kind==='seggroup' || seg.kind==='oneof') {
        if(!seg.seglist || seg.seglist.length==0) {
            return;
        }
        for(let sg of seg.seglist) {
            parseSegType(file, sg);
        }
    } else {
        console.log('ERR seg.kind', seg.kind)
    }
}

//解析一个协议
function parseProtocol(file, prot_asts, dir) {
    let text = fs.readFileSync(file, "utf8");
    let asts = parser.parse(text);

    if(asts && asts.length>0) {
        for(let ast of asts) {
            if(ast.kind ==='protocol') {
                let rename = prot_asts.find(it=>it.name===ast.name);
                if(rename) {
                    throw new Error(`协议"${ast.name}"重复定义: "${path.relative(dir, file)}", "${rename.src}"`)
                }
                ast.src = path.relative(dir, file);
                prot_asts.push(ast);
            }
        }
    }
}


//解析目录文件下所有的协议
function parseProtocols(pf) {
    pf = path.resolve(pf)
    let files =[];
    getEtls(pf, files);
    if(files.length == 0) {
        return [];
    }
    let asts = [];
    for(let f of files) {
        parseProtocol(f, asts, pf);
    }
    for(let p of asts) {
        parseSegType(p.src, p);
    }
    return asts;
}


module.exports = parseProtocols;