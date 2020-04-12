# ETestDev开发手册

- ETestDev是ETest中核心功能组件复用库，主要目的是用于二次定制开发使用

- ETestDev主要有 SDK、ETL、ETestD 和 ETestX 等组成

    * `SDK` 提供二次开发使用的API
    * `ETL` 用于描述测试执行环境对象
    * `ETestD` 二进制执行程序，随操作系统一起启动的ETest守护服务
    * `ETestX` 二进制执行程序，测试程序执行引擎，以事件循环模式工作

- ETestDev中各组成部分的相互关系如图：

![ETestDev系统架构](https://assets.processon.com/chart_image/5e8b29e6e4b03bfcd082a5fb.png)