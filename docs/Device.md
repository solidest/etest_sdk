# 设备接口配置项


## udp

### 接口参数
+ `{ ip: '127.0.0.1', port: 3000, ttl: 20 } `
+ `ip`指定接口使用的ip地址
+ `port`指定接口监听的网络端口
+ `ttl`udp报文网络存活周期

### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`
+ `to_port`属性用于指定广播报文发送的目标端口，如`{ to_port = 8000 }`

### 控制指令
+ 无

## tcp_client

### 接口参数

+ `{ ip: '127.0.0.1', port: 8888, keepalive: true, nodelay: true, autoconnect: true }`
+ `ip`指定接口使用的ip地址
+ `port`指定网络接口
+ `keepalive`保持长连接
+ `nodelay`禁用带外发送
+ `autoconnect`自动连接到服务器

### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`

### 控制指令
+ `connect`建立到服务端的连接
+ `disconnect`关闭到服务端的连接
+ 支持同步控制、异步控制


## tcp_server

### 接口参数

+ `{ ip: '127.0.0.1', port: 8888, keepalive: true, nodelay: true, acceptany: false }`
+ `ip`指定接口使用的ip地址
+ `port`指定网络接口
+ `keepalive`保持长连接
+ `nodelay`禁用带外发送
+ `acceptany`接收任意客户端接入，默认为false，只接收拓扑中已定义的客户端接入

### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`

### 控制指令
+ `listclient`获取已连接客户端列表
+ 仅支持同步操作

