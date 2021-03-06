
## ETestDev SDK更新说明

### 1.0.1
- etl-cli 新增-v选项 查看当前版本
- etl-cli 新增`ping`命令 用于测试和执行器的连接，连接正常返回`pong`
- etl中的表达式全部严格限定为lua的语法`and or ~=`, 不再兼容`&& !=`等符号
- segment 新增属性`scale` 用于设置协议段的缩放系数，打包时乘以系数，解包时除以系数
- segment 新增属性`option` 用于设置协议段的附加属性，该属性值被设计器使用，执行器协议解析时不使用该属性

### 0.2.2
- 增加record记录功能
- 增加数据持久化记录功能

### 0.2.1
- 新增etl命令行执行功能
- 在命令行执行etl，查看命令参数说明
- etl命令执行时需要指定配置文件
- etl命令的配置文件使用yaml格式（[学习教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)）
- etl命令默认会使用`index.yml`配置文件

### 0.2.0
- rpc传输机制替换为MessagePack格式

### 0.1.1
- 更新run.js文件
- 配合`log`API 在控制台输出带颜色背景信息

## ETestD

### 0.2.2
- 增加record记录功能

### 0.2.1
- 兼容etl命令行执行功能

### 0.2.0
- rpc传输机制替换为MessagePack格式
- 去除对协程库的依赖，以适配龙芯CPU

### 0.1.3
- 将API `entry` 合并入 `output`


## ETestX

### 0.2.3
- 协议对象、设备接口对象未定义使用时引发错误异常

### 0.2.2
- entry 事件时间戳由0改为1，以保证time唯一性
- 增加record记录功能

### 0.2.1
- 兼容etl命令行执行功能

### 0.2.0
- rpc传输机制替换为MessagePack格式
- 去除对协程库的依赖，以适配龙芯CPU
- UDP中不再使用连接绑定模式，由于服务端口启动顺序会导致ICMP回复`connection refused`异常
- 新增log.check(str_info, b_result) 输出检查结果日志

### 0.1.10
- API `send` 添加了一个整数类型返回值，表示已发送字节长度
- 基础库新增 API `recv`，用于同步接收数据，用法：`msg, opt = recv(connector, nil|protocol, timeout)`
    - 第一个输入参数必须为设备接口
    - 第二个输入参数可以为nil或协议，为nil时接收原始字节，为协议时接收协议解析后的报文
    - 第三个输入参数指定超时时间，单位ms，默认值0，timeout=0时会立即返回结果
    - 返回2个值，第一个值为：string或协议解析后的message，第二个值为：nil或option
- 新增异步API库`async`，成员包括:
    - `async.timeout` 延时定时器，用法：`id = async.timeout(tout, fn, ...)`
        - 指定时间后执行一个函数，返回定时器id
        - 第一个参数必须为大于0的数字，指定延时ms数
        - 第二个参数必须为函数，后面可以输入可变数量函数执行时的参数
    - `async.interval` 周期定时器，用法:`id = async.interval(delay, intv, fn, ...)`
        - 延时指定时间后开始周期性执行函数，返回定时器id
        - 第一个参数为数字，指定延时ms数
        - 第二个参数为大于0的数字，指定间隔周期ms数
        - 第三个参数必须为函数，后面可以输入可变数量函数执行时的参数
    - `async.clear` 清除定时器，用法：`async.clear(id)`
        - 清除输入参数id对应的定时器
    - `async.send` 异步发送，用法：`async.send(connector, msg, option, fn_callback)`
        - 比同步send函数的输入参数多一个回调函数
        - 回调函数的输入参数与同步send的返回值相同
    - `async.recv` 异步接收，用法：`async.recv(connector, nil|protocol, timeout, fn_callback)`
        - 比同步send函数的输入参数多一个回调函数
        - 回调函数的输入参数与同步recv的返回值相同
    - `async.on_recv` 订阅数据到达事件，用法：`async.on_recv(connector, nil|protocol, fn_callback)`
    - `async.off_recv` 取消数据到达事件的订阅，用法：`async.off_recv(connector)`


### 0.1.9
- unpack 解包成功后返回第二个返回值，解包使用的字节长度
- 新增内置对象 `device`，成员为所有绑定到etest的设备接口对应的C对象
- 基础库新增 API `send`，用于同步发送数据
    - 3个输入参数依次为：发送使用的设备接口、str或msg、可选的option
    - str可以是字符串也可以是二进制buffer
    - msg必须是由message api创建的返回值
    - option数据类型必须为对象，用来设置发送数据时的参数选项，不同的接口类型属性不同
    - 增加udp接口驱动支持
    - 点对点连接中option可以省略
    - 总线连接中通过设置option的`to`属性标识目标设备接口
    - 通过设置option的`to_port`属性发送广播报文


### 0.1.8
- 数组类型的协议段，可以在autovalue中设置自动赋值

### 0.1.7
- string结尾符解析方式下，最大长度限制为3000字节，防止极端情况解析器内存溢出
- 优化解析器插件输入参数

### 0.1.6
- `string`类型协议段支持设置成数组
- API基础库中去掉了 `warn`
- API中增加可`log`库，包含有：

    - `log.info`
    - `log.warn`
    - `log.error`
    - `log.step`
    - `log.action`