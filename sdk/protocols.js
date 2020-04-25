
/**
 * 协议解析模块
 * 提取etl中的协议描述
 * 返回的解析结果为协议对象数组
 */
const path = require("path");
const fs = require("fs");
// const parser = require("./parser/etxParser")
const segparser = require("./parser/segParser")

// //获取目录下所有的etl文件
// function getEtlFiles(pf, results) {
//     if(!fs.existsSync(pf)) {
//         return;
//     }

//     let st = fs.statSync(pf);
//     if(st.isFile()) {
//         if(path.extname(pf)!=='.etl') {
//             return;
//         }
//         results.push(pf);
//         return;
//     }

//     if(st.isDirectory()) {
//         let dir = fs.readdirSync(pf);
//         for(let p of dir) {
//             getEtlFiles(path.join(pf, p), results);
//         }        
//     }
// }

//分析解析器字符串
function getSegTypeFromStr(seg, pser, vp, file) {
    try {
        let ast = segparser.parse(vp);
        seg.kind = ast.type;
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
function getPackUnpack(seg, pser, props, file) {
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
    seg.kind = "string";

    return;
}

const _porps_dels = [
    'name_from',
    'name_to',
    'name_line',
    'exp_from',
    'exp_to',
    'exp_line',
    'props',
    'parser'
]

//清除多余的属性
function clearprops(o) {
    for(let pn of _porps_dels) {
        if(o[pn]) {
            delete o[pn]
        }
    }
}

const _props_nams = [
    'parser',
    'autovalue',
    'length',
    'endwith'
];

//检查属性名称是否都在有效范围内
function checkSegProps(seg, file) {
    if(seg.kind !== 'nil') {
        for(let p of seg.props) {
            if(!_props_nams.includes(p.name)) {
                throw new Error(`无法识别的属性"${p.name}" (${file} : ${p.name_line||''})`)
            } else {
                seg[p.name] = p.value;
            }
        }
    }
    clearprops(seg);
}

//解析一个实体字段的解析器类型
function parseSegType(file, seg) {
    if(seg.kind==="segment") {
        if(!seg.props || seg.props.length===0) {
            seg.kind = "nil";
            return checkSegProps(seg, file);
        }

        let pser = seg.props.find(it=>it.name==='parser');
        if(!pser) {
            throw new Error(`"parser"属性未设置(${file} : ${pser.value_line||''})`);
        }
        if(pser.value.kind === 'string') {
            getSegTypeFromStr(seg, pser, pser.value.value, file);
        } else if(pser.value instanceof Array) {
            getPackUnpack(seg, pser, pser.value, file);
        } else {
            throw new Error('ERR parser.kind : ' + typeof pser.value, pser)
        }
        return checkSegProps(seg, file);

    } else if(seg.kind==='protocol' || seg.kind==='seggroup' || seg.kind==='oneof') {
        if(!seg.seglist || seg.seglist.length==0) {
            clearprops(seg);
            return;
        }
        for(let sg of seg.seglist) {
            parseSegType(file, sg);
        }
        clearprops(seg);
    } else {
        throw new Error('ERR seg.kind : ' + seg.kind)
    }
}

// //解析一个协议
// function parseProtocol(file, prot_asts, dir) {
//     let text = fs.readFileSync(file, "utf8");
//     let asts = parser.parse(text);

//     if(asts && asts.length>0) {
//         for(let ast of asts) {
//             if(ast.kind ==='protocol') {
//                 let rename = prot_asts.find(it=>it.name===ast.name);
//                 if(rename) {
//                     throw new Error(`协议"${ast.name}"重复定义: "${path.relative(dir, file)}", "${rename.src}"`)
//                 }
//                 ast.src = path.relative(dir, file);
//                 prot_asts.push(ast);
//             }
//         }
//     }
// }


// //解析目录文件下所有的协议
// function _parseProtocols(pf) {
//     pf = path.resolve(pf)
//     let files =[];
//     getEtlFiles(pf, files);
//     if(files.length == 0) {
//         return [];
//     }
//     let asts = [];
//     for(let f of files) {
//         if(path.extname(f)!==".etl") {
//             continue;
//         }
//         try {
//             parseProtocol(f, asts, pf);
//         } catch (error) {
//             throw new Error(`解析文件"${path.relative(pf, f)}"出错: ${error.message}`)
//         }
//     }
//     for(let p of asts) {
//         parseSegType(p.src, p);
//     }
//     return asts;
// }

//解析全部协议
function parseProtocols(asts) {
    let res = [];
    for(let ast of asts) {
        if(ast.kind ==='protocol') {
            let rename = res.find(it=>it.name===ast.name);
            if(rename) {
                throw new Error(`协议"${ast.name}"重复定义: "${ast.src}", "${rename.src}"`)
            }
            res.push(ast);
        }
    }

    for(let p of res) {
        parseSegType(p.src, p);
    }

    return res;
}


module.exports = parseProtocols;