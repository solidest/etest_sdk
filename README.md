
# ETestDev开发手册

## Outer Api
ETest与外部交互使用的API，主要目的是供UI程序集成时使用

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

## Inner Api

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

#### error

- 输出一个错误对象
- 测试程序会自动退出

#### xxx

- lua内置的全局api函数

### string库

#### string.hex

- 将buffer转为16进制字符串，以用于阅读输出

#### string.buf

- 将16进制字符串转为buffer，以用于通信使用

#### string.xxx

- lua内置的string函数


### math库

