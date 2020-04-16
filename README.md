
# ETestDev更新说明

## SDK

### 0.1.1
- 更新run.js文件
- 配合`log`API 在控制台输出带颜色背景信息

## ETestD

### 0.1.3
- 将API `entry` 合并入 `output`


## ETestX

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