
const loki = require('lokijs');
const fs = require('fs');

let _db = null;


//初始化数据库
function _databaseInitialize(run_id) {
    let dbf = 'logdb/' + run_id + '.json';
    if(fs.existsSync(dbf)) {
        fs.unlinkSync(dbf);
    }
    _db = new loki(dbf, {
        autoload: true,
        autosave: true, 
        autosaveInterval: 4000
    });

    _db.addCollection("syslog", {
        unique: ['time']
    });

    _db.addCollection("record", {
        unique: ['time']
    });
}

//输出记录到数据库
function save(run_id, data) {
    if(!_db) {
        _databaseInitialize(run_id);
    }
    let coll_syslog = _db.getCollection("syslog");
    let coll_record = _db.getCollection("record");
    for(let r of data) {
        switch (r.catalog) {
            case 'system':
            case 'log':
                coll_syslog.insert(r);
                break;
            case 'record':
                coll_record.insert(r);
                break;
            default:
                throw new Error(JSON.stringify(data));
        }
    }
}

//关闭之前保存数据
function close() {
    if(!_db) {
        return;
    }
    _db.saveDatabase();
}

module.exports = {
    save, close
}