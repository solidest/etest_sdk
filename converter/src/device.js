const shortid = require("shortid");
const helper = require("./helper");
const KIND = 'device';

function _set_props(obj, props) {
    if (!props) {
        return;
    }
    props.forEach(prop => {
        let v = helper.exp2str(prop.value, true);
        obj[prop.name] = v;
    });
}

function device_etl2dev(ast) {
    let items = [];

    let dev = {
        kind: KIND,
        name: ast.name,
        content: items,
    };

    if (!ast.value) {
        return dev;
    }

    ast.value.forEach(conn => {
        if(conn.kind === 'connector') {
            let item = {
                id: shortid.generate(),
                kind: conn.type,
                name: conn.name,
            }
            _set_props(item, conn.config);
            items.push(item);
        }
    })
    return dev;
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

function _append_code_conn(codes, level, it) {
    _append_code(codes, level, `${it.kind} ${it.name} {`);
    let ignore = ['name', 'kind', 'id']
    helper.append_codes_objprops(codes, level+1, it, ignore);
    _append_code(codes, level, '}');
}

function device_dev2etl(content, name, memo) {
    content = content || [];
    let codes = [];
    if (memo) {
        _append_code(codes, 0, `// ${memo}`);
    }
    _append_code(codes, 0, `device ${name} {`);
    content.forEach(it => {
        _append_code_conn(codes, 1, it);
    })
    _append_code(codes, 0, '}');
    let texts = codes.map(it => `${'\t'.repeat(it.level)}${it.code}`);
    return texts.join('\n');
}

module.exports = {
    device_etl2dev,
    device_dev2etl,
};