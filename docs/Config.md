
## 项目配置

项目的全局配置

```

# 项目设置
project:
  id: 18cde1dd-1907-4bd9-96cc-7fc89489665c  # 项目唯一id
  path: .  # 项目文件根目录，绝对路径或相对路径
  lib_path: libs
  xtra: xtra.lua # 项目使用的协议解析插件
  etestd_ip: etest # etest服务的ip地址或主机名
  etestd_port: 1210 # etest服务的端口号

```


## 执行配置

用例执行的配置

```

# 执行程序设置
program:
  demo: # run_id
    src: program/demo.lua
    topology: topo_udp
    vars:
  t_udp: # run_id
    src: program/t_udp.lua #指定执行的脚本文件
    topology: topo_udp  #指定执行使用的拓扑环境
    vars: {} #执行输入参数
    option: #执行设置选项
      real_time: true  # 是否启用实时模式
      rt_cycle: 1000   # 实时任务调度周期(us)
      rt_policy: auto  # 实时任务执行策略, auto:自动 speed_first:执行速度优先 memory_first:内存占用优先

```

## 设备接口配置

### udp

#### 接口参数
+ `{ ip: '0.0.0.0', port: 3000, ttl: 20, reuseaddr: true } `
+ `[ip]`指定接口使用的ip地址
+ `[port]`指定接口监听的网络端口
+ `[ttl]`udp报文网络存活周期
+ `[reuseaddr]`复用udp地址和端口

#### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`
+ `to_port`属性用于指定广播报文发送的目标端口，如`{ to_port = 8000 }`

#### 控制指令
+ `JoinGroup`加入组播群，同步执行
+ `LeaveGroup`退出组播群，同步执行

### tcp_client

#### 接口参数

+ `{ ip: '127.0.0.1', port: 3333, keepalive: true, nodelay: false, autoconnect: true }`
+ `[ip]`指定接口使用的ip地址
+ `[port]`指定网络接口
+ `[keepalive]`保持长连接
+ `[nodelay]`禁用带外发送
+ `[autoconnect]`自动连接到服务器

#### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`

#### 控制指令
+ `Connect`建立到服务端的连接，同步/异步执行
+ `Disconnect`关闭到服务端的连接，同步/异步执行

### tcp_server

#### 接口参数

+ `{ ip: '127.0.0.1', port: 8080, keepalive: true, nodelay: true, acceptany: false }`
+ `ip`指定接口使用的ip地址
+ `port`指定网络接口
+ `[keepalive]`保持长连接
+ `[nodelay]`禁用带外发送
+ `[acceptany]`接收任意客户端接入，默认为false，只接收拓扑中已定义的客户端接入

#### 操作选项
+ `to`属性用于指定报文发送时的目标，如`{ to = 'dev1.conn1' }`

#### 控制指令
+ `ListClients`获取已连接客户端列表，同步执行
+ `Refuse`主动关闭客户端连接，同步执行
+ `Start`启动监听，同步执行
+ `Stop`停止服务，同步执行


### serial_232｜422｜485｜ttl

#### 接口参数

+ `{ baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' }`
+ `[baudrate]`波特率
+ `[bytesize]`数据位，取值`5|6|7|8`
+ `[parity]`校验方式，取值：`'none'|'odd'|'event'|'mark'|'space'`
+ `[stopbits]`停止位，取值：`1|2|1.5`
+ `[flowcontrol]`流控制方式，取值：`'software'|'hardware'|'none'`

#### 操作选项
+ 无

#### 控制指令
+ `SetBreak`同步执行设置Break
+ `SetRTS`同步执行设置RTS值
+ `SetDTR`同步执行设置DTR值
+ `GetCTS`同步执行获取CTS值
+ `GetDSR`同步执行获取DSR值
+ `GetRI`同步执行获取RI值
+ `GetCD`同步执行获取CD值