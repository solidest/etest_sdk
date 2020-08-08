const loki = require('lokijs');
let _db = null;
let _run_id = null;

//初始化数据库
function _databaseInitialize(f) {
    _db = new loki(f, {
        autoload: false,
        autosave: false,
    });

    _db.addCollection("record", {
        unique: ['$time'],
        ttl: 30000, //最大存活时长
        ttlInterval: 60000, //ttl清理周期
    });
}

//添加记录到数据库
function save(run_id, rcds) {
    if (_run_id !== run_id) {
        _run_id = run_id;
        _databaseInitialize(run_id + '.db');
    }
    let coll = _db.getCollection("record");
    for (let r of rcds) {
        if(r.value) {
            let rv = r.value;
            rv['$time'] = r.time;
            coll.insert(rv);
        }
    }
}

//从数据库查询数据 limit指定数量
function find(run_id, filter, sort, limit) {
    if (_run_id !== run_id || !_db || !filter || !sort || !limit) {
        return [];
    }
    let coll = _db.getCollection("record");
    return coll.chain().find(filter).simplesort(sort).limit(limit).data();
}


//从数据库中查询最后一段数据 limit指定sort字段上的偏移量
function last(run_id, filter, sort, limit) {
    if (_run_id !== run_id || !_db || !filter || !sort || !limit) {
        return [];
    }
    let coll = _db.getCollection("record");

    //找到sort字段的最大值
    let res = coll.chain().find(filter).compoundsort([
        [sort, true]
    ]).limit(1).data();
    let max = null
    if (res && res.length > 0) {
        max = res[0][sort];
    }
    // console.log(sort, 'max =', max, '; filter =', JSON.stringify(filter))
    // console.log(res)
    if (isNaN(max)) {
        return [];
    }

    let limit_filter1 = {}
    let limit_filter2 = {}

    limit_filter1[sort] = {
        '$gt': max - limit
    }
    limit_filter2[sort] = {
        '$lte': max
    }

    return coll.chain().find({
        '$and': [filter, limit_filter1, limit_filter2]
    }).simplesort(sort).data();
}


// 通过合并记录获取状态值
function merge(run_id, filter) {
    if (_run_id !== run_id || !filter) {
        return {};
    }
    let res = {};
    let coll = _db.getCollection("record");
    let rcds = coll.find(filter);
    for(let r of rcds) {
        for(let k in r) {
            if(k === '$loki' || k === '$time' || k === 'meta') {
                continue;
            }
            res[k] = r[k];
        }
    }
    return res;
}

module.exports = {
    save,
    find,
    last,
    merge
}