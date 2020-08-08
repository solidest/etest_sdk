

//接口
class Connector {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.config = {};
    }

    addConfig(key, value) {
        if(this.config[key]) {
            throw new Error(`设备 ${this.name} 的参数 ${key} 重复设置`);
        }
        this.config[key] = value;
    }
}

//设备
class Device {
    constructor(name) {
        this.name = name;
        this.connectors = [];
    }

    addConnector(conner) {
        let find = Device.findConnector(this, conner.name);
        if(find) {
            throw new Error(`接口 ${this.name}.${conner.name} 重复定义`);
        } else {
            this.connectors.push(conner);
        }
    }

    static findConnector(dev, name) {
        return dev.connectors.find(it=>it.name===name);
    }
}

//拓扑
class Topology {

    constructor(name) {
        this.name = name;
        this.devices = [];
    }

    tryAddDevice(dev) {
        let _dev = this.findDevice(dev.name)
        if(_dev) {
            return _dev;
        }
        _dev = JSON.parse(JSON.stringify(dev));
        this.devices.push(_dev);
        return _dev;
    }

    findDevice(name) {
        return this.devices.find(it=>it.name===name);
    }

    setMap(devname, maptype) {
        let dev = this.findDevice(devname);
        if(dev.map) {
            throw new Error(`拓扑 ${this.name}.mapping 中重复引用了设备 ${devname} 的映射`);
        }
        dev.map = maptype;
    }

    setBind(devname, connname, uri) {
        let dev = this.findDevice(devname);
        let conn = Device.findConnector(dev, connname);
        if(!conn) {
            throw new Error(`拓扑 ${this.name}.binding 中引用了未定义的接口 ${devname}.${connname}`);
        }
        if(conn.uri) {
            throw new Error(`拓扑 ${this.name}.binding 中重复设置了接口 ${devname}.${connname}`);
        }
        let uris = uri.replace(/\s/g, '').split("@");
        if(uris.length===1) {
            conn.uri = uris[0];
        } else if(uris.length===2) {
            conn.uri = uris[0];
            conn.host = uris[1];
        }
    }

    setLink(linkname, line) {
        if(!line) {
            return;
        }
        for(let conn of line) {
            if(!conn) {
                continue;
            }
            let dev = this.findDevice(conn.device);
            let conner = Device.findConnector(dev, conn.connector);
            if(!conner) {
                throw new Error(`拓扑 ${this.name}.linking.${linkname} 中引用了未定义的接口 ${conn.device}.${conn.connector}`);
            }
            if(conner.link) {
                throw new Error(`拓扑 ${this.name}.linking.${linkname} 中重复设置接口 ${conn.device}.${conn.connector} 连接`);
            }
            let _line = [];
            for(let _conn of line) {
                if(_conn !== conn) {
                    _line.push(_conn);
                }
            }
            if(_line.length<1) {
                throw new Error(`拓扑 ${this.name}.linking.${linkname} 设置错误`);
            }
            conner.link = linkname;
            if(_line.length == 1) {
                conner.target = {device: _line[0].device, connector: _line[0].connector};
            } else {
                conner.targets = [];
                for(let l of _line) {
                    conner.targets.push({device: l.device, connector: l.connector});
                }
            }
        }
    }

    checkAll() {
        for(let dev of this.devices) {
            //检查设备映射
            if(!dev.map) {
                throw new Error (`拓扑 ${this.name} 中引用的设备 ${dev.name} 未设置映射`);
            }

            //检查设备接口
            for(let connor of dev.connectors) {

                //检查连接
                if(!connor.link) {
                    console.error('\x1B[33m%s\x1B[39m', "WARNING", `拓扑 ${this.name} 中引用的设备接口 ${dev.name}.${connor.name} 未设置连接`);
                }

                //绑定检查
                if(connor.uri) {
                    if(dev.map==='uut') {
                        throw new Error (`拓扑 ${this.name} 中设备映射与接口绑定存在冲突: ${dev.name}.${connor.name}`);
                    }
                } else if(connor.link) {
                    if(dev.map!=='uut') {
                        //警告接口未设置绑定
                        console.error('\x1B[33m%s\x1B[39m', "WARNING", `拓扑 ${this.name} 中引用的设备接口 ${dev.name}.${connor.name} 未设置绑定`);
                    }
                }

            }
        }
        return;
    }

}

//解析所有topo图
function parseTopologys(asts, odevs) {
    let res = [];
    for(let topo of asts) {
        let otopo = new Topology(topo.name);
        if(!topo.value) {
            continue;
        }

        //找到所有被引用的设备
        for(let v of topo.value) {
            if(v.kind === 'linking') {
                if(v.value) {
                    for(let vv of v.value) {
                        let dev = odevs.find(it=>it.name===vv.device);
                        if(!dev) {
                            throw new Error(`拓扑 ${topo.name}.linking.${v.name} 中引用了未定义设备 ${vv.device}`);
                        }
                        otopo.tryAddDevice(dev);
                    }
                }
            } else if(v.kind === 'uut' || v.kind=='etest') {
                if(v.value) {
                    for(let vv of v.value) {
                        let dev = odevs.find(it=>it.name===vv);
                        if(!dev) {
                            throw new Error(`拓扑 ${topo.name}.mapping.${v.kind} 中引用了未定义设备 ${vv}`);
                        }
                        otopo.tryAddDevice(dev);
                        //设置设备映射
                        otopo.setMap(vv, v.kind);
                    }
                }
            } else if(v.kind === 'binding') {
                let dev = odevs.find(it=>it.name===v.device);
                if(!dev) {
                    throw new Error(`拓扑 ${topo.name}.binding 中引用了未定义设备 ${v.device}`);
                }
                otopo.tryAddDevice(dev);

                //设置接口绑定
                otopo.setBind(v.device, v.connector, v.bind);
            } else {
                throw new Error('未识别类型 ' + v.kind);
            }
        }

        //推断连接目标
        //找到所有被引用的设备
        for(let v of topo.value) {
            if(v.kind !== 'linking') {
                continue;
            }
            otopo.setLink(v.name, v.value);
        }
        otopo.checkAll();
        res.push(otopo);
    }
    return res;
}

//解析所有设备
function parseDevices(asts) {
    let res = [];
    for(let dev of asts) {
        let odev = new Device(dev.name);
        if(dev.value) {
            for(let conn of dev.value) {
                let connor = new Connector(conn.type, conn.name);
                if(conn.config) {
                    for(let cfg of conn.config) {
                        if(cfg.value.kind === 'uminus' && cfg.value.exp.kind === 'number') {
                            cfg.value.value = -(cfg.value.exp.value);
                        }
                        if(cfg.name && cfg.value && (cfg.value.value !== null && cfg.value.value !== undefined))
                            connor.addConfig(cfg.name, cfg.value.value);
                    }
                }
                odev.addConnector(connor);
            }
        }
        res.push(odev);
    }
    return res;
}


function parseHardEnv(asts) {
    let topos = [];
    let devs = [];
    for(let ast of asts) {
        if(ast.kind ==='device') {
            let rename = devs.find(it=>it.name===ast.name);
            if(rename) {
                throw new Error(`设备"${ast.name}"重复定义: "${ast.src}", "${rename.src}"`)
            }
            devs.push(ast);
        } else if(ast.kind === 'topology') {
            let rename = topos.find(it=>it.name===ast.name);
            if(rename) {
                throw new Error(`拓扑"${ast.name}"重复定义: "${ast.src}", "${rename.src}"`)
            }
            topos.push(ast);
        }
    }

    let odevs = parseDevices(devs);
    return parseTopologys(topos, odevs);
}


module.exports = parseHardEnv;