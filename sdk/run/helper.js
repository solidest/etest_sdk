
function has_error(check_result) {
    for(let k in check_result) {
        if(check_result[k].$count) {
            return true;
        }
    }
    return false;
}

function format_item_system(item) {
    let text = '';
    let tag = {is_system: true}
    switch (item.kind) {
        case 'start':
            text = '执行器启动成功';
            break;
        case 'entry':
            text = '调用入口函数成功';
            break;
        case 'exit':
            text = '用例执行完成';
            break;
        case 'stop':
            text = '执行记录已保存';
            tag.is_exit = true;
            break;
        case 'print':
            text = item.value.message;
            tag.is_print = true;
            tag.is_console = true;
            break;
        case 'error':
            text = item.value.message;
            tag.is_error = true;
            break;
        case 'assertFail':
            text = '断言失败 ' + item.value.message;
            tag.is_error = true;
            tag.is_console = true;
            break;
        case 'verifyFail':
            text = '验证失败 ' + item.value.message;
            tag.is_error = true;
            tag.is_console = true;
            break;
        default:
            console.log('TODO format system', item);
    }
    return {
        tag: tag,
        text: text,
    }
}

function format_item_log(item) {
    let text = '';
    let tag = {is_log: true, is_console: true}
    switch (item.kind) {
        case 'info':
            text = '日志::信息  ' + item.value.message;
            break;
        case 'error':
            text = '日志::错误  ' + item.value.message;
            tag.is_error = true;
            break;
        case 'warn':
            text = '日志::警告  ' + item.value.message;
            tag.is_warn = true;
            break;
        case 'step':
            text = '日志::步骤  ' + item.value.message;
            break;
        case 'action':
            text = '日志::动作  ' + item.value.message;
            break;
        case 'doing':
            text = '日志::正在进行  ' + item.value.message;
            break;
        case 'check':
            text = (item.value.result ? '日志::检查成功  ':'日志::检查失败  ') + item.value.message;
            if(item.value.result) {
                tag.is_success = true;
            } else {
                tag.is_error = true;
            }
            break;
        default:
            console.log('TODO format log', item);
    }
    return {
        tag: tag,
        text: text,
    }
}

function _clone_rcd(it) {
    let res = {};
    for(let k in it) {
        if(!['meta', '$loki'].includes(k)) {
            res[k] = it[k];
        }
    }
    return res;
}

function format_item_record(item) {
    let rcds = item.front_rcds.map(it => JSON.stringify(_clone_rcd(it)));
    if(item.back_rcds.length>0){
        if(item.count > (item.front_rcds.length + item.back_rcds.length)) {
            rcds.push('... ...');
        }
        rcds = rcds.concat(item.back_rcds.map(it => JSON.stringify(_clone_rcd(it))));
    }
    return {
        tag: {is_record: true},
        text: `生成记录${item.count}条`,
        tip:  rcds.join('\n')
    }
}

function format_item_ask(item) {
    return {
        tag: {is_print: true, is_ask: true},
        text: (item.value ? item.value.msg : '')||'ask',
    }
}

function format_item(item) {
    let it;
    switch (item.catalog) {
        case 'system':
            it = format_item_system(item);
            break;
        
        case 'log':
            it = format_item_log(item);
            break;

        case 'record':
            it = format_item_record(item);
            break;

        case 'ask':
            it = format_item_ask(item);
            break;

        default:
            console.log('TODO format', item);
    }
    it.$time = item.time;
    let ms = Math.floor(item.time/1000/1000);
    let s = Math.floor(ms/1000);
    ms = ms - s*1000;
    it.time = `${s}s${ms}ms`;
    return it;
}

export default {
    has_error,
    format_item,
}