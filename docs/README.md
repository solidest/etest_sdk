# ETestDev

![ETestIDE操作手册](https://solidest.github.io/etest_sdk/dev_ide/#/README)

ETestDev是嵌入式系统测试开发工具套件，由多个开发组件构成，主要包括ETL编译器、测试程序执行器、监控界面渲染器、多个组件库，以及vscode插件、命令行工具等。  
ETestDev支持windows、linux、mac等多种操作系统，兼容各种国产cpu、国产操作系统。  
ETestDev主要用于快速构建测试工具软件、测试工装、检测设备。  
研发人员可将ETestDev作为中间件，用来快速开发嵌入式测试系统。  
面向专业测试人员，凯云公司提供基于ETestDev的专用测试工具定制服务。  

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