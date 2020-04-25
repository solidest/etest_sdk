# ETestDev

ETestDev是嵌入式测试开发中间件

## ETestDev设计

- ETestDev参照`MVVM`模型，在分布式环境中进行实现

![三层架构](https://assets.processon.com/chart_image/5ea422d007912948b0da38a8.png)

## ETestDev架构

- ETestDev主要由 SDK、ETL、ETestD、ETestX、DevTools 等模块组成

    * `SDK` 提供二次开发使用的 API
    * `ETL` 嵌入式测试领域专用语言，用于描述测试环境中各要素
    * `ETestD` 二进制执行程序，随操作系统一起启动的ETest守护服务
    * `ETestX` 二进制执行程序，测试程序执行引擎，以事件循环模式工作
    * `DevTools` 多个定制开发时使用的实用工具

- ETestDev中各组成部分的相互关系如图：

![ETestDev系统架构](https://assets.processon.com/chart_image/5e8b29e6e4b03bfcd082a5fb.png)