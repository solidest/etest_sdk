
/**
 * 上位机rpc客户端模块
 * Frame负责原始字节流与JSON对象之间的转换
 * NetWork负责TCP传输
 * RpcTask负责rpc调度
 */

const net = require('net');
const msgpack = require("msgpack-lite");
const magic = 0x7777;

//打包解包
class Frame {

    //打包数据
    static pack(body) {
        let buf_body = msgpack.encode(body); //Buffer.from(JSON.stringify(body), 'utf8');
        //console.log("pack len:", buf_body.length);
        let buf_magic = Buffer.alloc(4);
        buf_magic.writeInt32LE(magic);
        let buf_len = Buffer.alloc(4);
        buf_len.writeInt32LE(buf_body.length);
        return Buffer.concat([buf_magic, buf_len, buf_body]);
    }

    constructor () {
        this._bufs = [];
    }

    //解包一个数据body
    _unpack(data_len) {

        let buf_len = 0;
        let idx = 0;

        //计算总长度
        for(let buf of this._bufs) {
            buf_len += buf.length;
            if(buf_len >= data_len) {
                break;
            }
            idx++;
        }

        //长度不足
        if(buf_len < data_len) {
            return null;
        }

        let buf = null;
        if(idx===0) {
            buf = this._bufs[0];
        } else {
            buf = Buffer.concat(this._bufs, data_len);
        }

        //去掉解析过的buffer
        if(buf_len === data_len) {
            this._bufs.splice(0, idx+1);
        } else {
            let first = this._bufs[idx];
            let bufs = [first.subarray(first.length-(buf_len-data_len))];
            let _blen = this._bufs.length;
            if(_blen > idx+1) {
                for(let i=idx+1; i<_blen; i++) {
                    bufs.push(this._bufs[i]);
                }
            }
            this._bufs = bufs;
        }
        //JSON.parse(buf.toString('utf8', 8, data_len)); 
        return msgpack.decode(buf.subarray(8, 8+data_len));
    }

    unpack(buf) {
        if(buf) {
            this._bufs.push(buf);
        }
        let count = this._bufs.length;
        if(count===0) {
            return null;
        }

        let first = this._bufs[0];
        if(first.length<8) {
            if(count===1) {
                return null;
            }
            first = Buffer.concat(this._bufs);
            this._bufs = [first];
            if(first.length<8) {
                return null;
            }
        }
        if(first.readInt16LE(2)!==magic) {
            throw new Error('json rpc error');
        }
        let body_len = first.readInt32LE(4);
        //console.log("body len:", body_len);
        return this._unpack(body_len + 8);
    }
}

//网络传输
class NetWork {
    constructor(ip, port, delay, recver) {
        this._ip = ip;
        this._port = port;
        this._frm = new Frame();
        this._recver = recver;
        if(!delay) {
            this._setupSocket();
        }
    }

    //发送
    send(body) {
        if(!this._socket) {
            this._setupSocket();
        } else if(this._closed) {
            this._reconnect();
        }
        this._socket.write(Frame.pack(body));
    }

    //重新连接
    _reconnect() {
        if(this._socket && !this._socket.destroyed) {
            this._closed = false;
            this._socket.connect(this._port, this._ip);
            return;
        }
        this._setupSocket();
    }

    //设置socket
    _setupSocket() {

        let self = this;
        let socket = net.connect(this._port, this._ip);
        self._socket = socket;
        self._closed = false;

        socket.setKeepAlive(true, 1);
        socket.on('data', function (data) {
            let body = self._frm.unpack(data);
            while(body) {
                self._recver.recvedTask(body);    //接收回调
                body = self._frm.unpack(null);
            }
        });

        socket.on('close', function () {
            self._closed = true;
        });

        socket.on('error', function (err) {
            console.error('on_error', err);
        });

        socket.on('end', function () {
            console.error('on_end');
        });

        socket.on('timeout', function () {
            console.error('on_timeout');
        });
    }
}

//rpc任务调度
class RpcTask {
    constructor(ip, port, delay) {
        this._tasks = [];
        this._nextid = 0;
        this._net = new NetWork(ip, port, delay, this);
    }

    //发送一个任务
    sendTask(task_info, call_back) {
        task_info.id = ++this._nextid;
        this._tasks.push({info: task_info, cb: call_back});
        this._net.send(task_info);
        return task_info.id;
    }

    //取消全部任务
    clear() {
        this._tasks = [];
    }

    //接收到任务回执
    recvedTask(recv_info) {
        let id = recv_info.id;
        let idx = this._tasks.findIndex(it => it.info.id===id);
        if(idx<0) {
            throw new Error('bad info:', JSON.stringify(recv_info));
        }
        let cb = this._tasks[idx].cb;
        this._tasks.splice(idx, 1);
        if(cb) {
            if(recv_info.error) {
                cb(recv_info.error, null, id);
            } else {
                cb(null, recv_info.result, id);
            }
        }
    }
}

module.exports = RpcTask;
