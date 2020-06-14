# 设备接口配置项


## udp

### 参数
+ `{ ip: '127.0.0.1', port: 3000, ttl: 20 } `
+ `ip`指定接口使用的ip地址
+ `port`指定接口监听的网络端口
+ `ttl`udp报文网络存活周期

### 选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`
+ `to_port`属性用于指定广播报文发送的目标端口，如`{ to_port = 8000 }`

## tcp_client

### 参数

+ `{ ip: '127.0.0.1', port: 8888, keepalive: true, autoconnect: true, nodelay: true }`
+ `ip`指定接口使用的ip地址
+ `port`指定网络接口
+ `keepalive`保持长连接
+ `autoconnect`自动建立与服务器的连接
+ `nodelay`禁用带外发送

### 选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`

### ioctl
+ `connect`建立到服务端的连接
+ `disconnect`关闭到服务端的连接
+ 支持异步操作

