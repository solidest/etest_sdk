
## 简介
ETL (Embedded Test Language)是专用于开发嵌入式测试程序的语言，采用ETL编写的测试程序可在ETL运行器上直接执行

## 组成结构
![ETL组成结构](https://solidest.github.io/etest_sdk/ETL_Topo.png)

+ `ETL`使用简洁易懂的语法描述测试程序的环境组成和执行脚本，包括：
    - `device` 设备接口描述
    - `topology` 连接拓扑描述
    - `protocol` 通信协议描述
    - `panle` 监控面板描述
    - `ETLua` 测试执行脚本 

+ `ETL运行器`负责编译并执行采用ETL开发的测试程序，包括：
    - `ETestD` ETL服务器
    - `ETestX` 测试程序执行器
    - `ETest` UI渲染器

## ETL语法入门

### 注释

+ ETL单行注释使用 //...
+ ETL多行注释使用 /* ... */
+ 注释的规则和 C、Java、C#、JavaScript等程序语言相同

### 字符串

+ ETL同时支持单引号字符串和双引号字符串
+ 字符串规则和Python、JavaScript等语言相同

### 根级元素
根级元素是ETL的直接组成单元，根级元素包括以下类型：
* `device`：设备接口描述
* `topology`：连接拓扑描述
* `panel`：监控面板描述
* `protocol`：通信协议描述

### 二级元素

* 二级元素描述只能出现在根级元素描述内部
* 不同类型的根级元素内，可用的二级元素类型不同

    > 举例：协议 `prot_1` ，由一个协议段 `seg_1` 组成

    ```
    prototcol prot_1 
    {
        segment seg_1 { ... } 
    } 
    ```

### ETL元素描述语法

+ 元素描述的语法为: `元素类型 元素名称 { ... }`，类似于程序语言class声明方式

    > 举例：设备拓扑描述  
    ```
    topology topo_1 
    { 
        ... 
    }
    ```

    > 举例：协议描述  
    ```
    protocol prot_1 
    { 
        ... 
    }
    ```

### 元素属性

* 每种元素都具有多个属性
* 元素属性赋值语法为： ` 属性名称: 属性值 `，类似于JavaScript里的字面量对象
* 多个元素属性连续赋值时使用逗号分隔，最后一个属性赋值后面的逗号可以省略

    > 举例：协议段 `seg_1` 的解析器属性为8位无符号整数
    ```
    segment seg_1 { parser: 'uint8' } 
    ```
## ETLua
ETLua 是开发测试程序的执行脚本时使用的编程语言
