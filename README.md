
# ETestDev开发手册

## ETL 嵌入式测试语言 ( Embedded Test Language )

- ETL 是ETest使用的描述语言
- ETL文件是扩展名为 `.etl` 的文本文件
- ETL文件由若干个根级元素声明组成

### 注释

- ETL单行注释使用 //...
- ETL多行注释使用 /* ... */
- 注释的规则和 C 系列程序语言相同



### ETL元素

- ETL元素是ETL文件的直接组成单元

#### ETL元素描述语法

- 元素描述的语法为: `元素类型 元素名称 { ... }`，类似于程序语言class声明方式

> 举例：设备拓扑描述  `topo topo_1 { ... }`

> 举例：协议描述  `protocol prot_1 { ... }`

#### 根级元素

ETL代码文件的根级元素包括以下类型：

- protocol：协议模版描述
- topo：环境拓扑描述
- panel：监控面板描述

#### 二级元素

- 二级元素描述只能出现在根级元素描述内部

- 不同类型的根级元素内，可用的二级元素类型不同

> 举例：协议 `prot_1` ，由一个协议段 `seg_1` 组成

> ` prototcol prot_1 { segment seg_1 { ... } } `

#### 元素属性

- 每种元素都具有多个属性

- 元素属性赋值语法为： ` 属性名称: 属性值 `，类似于JavaScript里的字面量对象

- 多个元素属性连续赋值时使用逗号分隔，最后一个属性赋值后面的逗号可以省略

- 举例：设置协议段 seg_1 的解析属性为32位整型解析

> ` segment seg_1 { parser: "int32", ... }`

## protocol 协议描述

- 用于描述一个协议模版
- 协议名称在同一项目内必须唯一


### segment 协议段

#### parser 解析器属性

- parser属性用于指定协议段的解析方式

#### autovalue 自动赋值属性

- 于协议打包时，如果协议段没有显示赋值，将自动使用autovalue属性值

#### string类型的属性 length endwith

### segments 协议段分组

- 将多个协议段分为一组，解析命名

### oneof 协议段分支

- 使用第一个表达式计算结果为true的分支进行解析

## Outer API

- ETest与外部交互使用的API，主要目的是供UI程序集成时使用

#### protocol

- 全局表对象
- 表内的元素是所有项目内描述的协议
- key值为协议名称
- value值为协议解析器对应的C语言对象

#### makeenv

-  创建项目执行环境

#### start 

- 启动执行项目内的一个测试程序

#### stop

- 强制停止测试程序的执行

#### state

- 查询当前etest执行器的状态

#### readout

- 读取执行器的输出数据

## Inner API

ETest内部执行用到的API，主要目的是开发测试程序时使用

### 基础库

#### print

- 命令行输出文本信息
- 输入参数可变数量
- 任意类型的数据均转为文本输出

#### exit

- 退出测试程序执行

#### assert

- 执行断言，第一个参数为fasle时退出程序
- 第二个参数为可选的断言失败时的提示信息

#### verify

- 执行判定，并返回判定结果，但不退出程序
- 第二个参数为可选的判定失败时的提示信息

#### delay

- 延时指定的 ms 时间

#### now

- 返回测试程序自启动至当前时长
- 默认返回时长单位是 ms
- 输入可选字符串参数 'ms' 或 'us' 或 'ns' 指定时长单位

#### message

- 用指定协议的创建消息
- 第二个可选参数用于初始化消息内容

#### pack

- pack(msg) 将消息打包
- pack(protocol.xxx, data) 使用指定协议打包数据
- 返回值是打包后的buffer

#### unpack

- unpack(protocol.xxx, buffer) 使用指定协议解包buffer
- 返回解包后的结果数据

#### error

- 输出一个错误对象
- 测试程序会自动退出

#### xxx

- lua内置的全局API函数

### string库

#### string.hex

- 将buffer转为16进制字符串，以用于阅读输出

#### string.buf

- 将16进制字符串转为buffer，以用于通信使用

#### string.xxx

- lua内置的string函数


### math库

#### math.isequal(f1, f2, is_double)

- 判定两个浮点数是否相等
- 第三个可选参数为布尔型，true：double方式比较， false：float方式比较
- 默认按float方式比较

### log库

#### log.info
#### log.warn
#### log.error
#### log.step
#### log.action

