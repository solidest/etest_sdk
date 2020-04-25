
## ETestDev SDK

ETestDev的二次开发程序包

### API
- SDK是使用ETestDev进行二次开发的软件代码库
- SDK中为开发上位机程序和开发测试程序分别提供API支持

### 入口函数
- 测试程序的入口函数名必须为 `entry`
- 入口函数接收2个参数，`vars`、`option`,分别用于用例输入参数值，和用户自定义选项


## Outer API
ETest与外部交互使用的API，主要目的是供UI程序集成时使用

### makeenv

-  创建项目执行环境

### start 

- 启动执行项目内的一个测试程序

### stop

- 强制停止测试程序的执行

### command

- 向ETest执行器发送一条自定义命令

### state

- 查询当前ETest执行器的状态

### readout

- 读取执行器的输出数据

## Inner API