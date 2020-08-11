
function program_dev2etl() {

}

function program_etl2dev() {

}


function _load_run(result, items, path) {
    if(!items) {
        return;
    }
    items.forEach(it => {
        if(it.kind === 'dir') {
            _load_run(result, it.children);
        } else if(it.kind === 'lua') {
            let r = {
                path: `${path}${it.name}.lua`,
                code
            };

            
            r.path = path.relative(proj_apath, run_apath);
            r.code = helper.read_text(run.src, proj_apath);
            r.vars = run.vars;
            r.option = run.option || {};
            r.option.topology = run.topology;
            result[it.id] = r;
        }
    })
}

// 加载全部执行程序对象
function program_load(root_items, topos) {
    let res = {};
    _load_run(res, items, '');
}


module.exports = {
    program_etl2dev,
    program_dev2etl,
    program_load,
};