
ETL ( Embedded Test Language )

+ ETL 是嵌入式测试专用描述语言 
+ ETL文件是扩展名为 `.etl` 的文本文件
+ ETL文件由ETL元素声明组成

### 注释

+ ETL单行注释使用 //...
+ ETL多行注释使用 /* ... */
+ 注释的规则和 C、Java、C#、JavaScript等程序语言相同

### 字符串

+ ETL同时支持单引号字符串和双引号字符串
+ 字符串规则和Python、JavaScript等语言相同


### ETL元素

+ ETL元素是ETL文件的直接组成单元

+ 根级元素包括以下类型：

    * [protocol](https://solidest.github.io/etest_sdk/#/PROTOCOL)：协议模版描述
    * device：设备及接口描述
    * topology：连接拓扑描述
    * panel：监控面板描述

+ 二级元素

    * 二级元素描述只能出现在根级元素描述内部
    * 不同类型的根级元素内，可用的二级元素类型不同

        > 举例：协议 `prot_1` ，由一个协议段 `seg_1` 组成

        ```
        prototcol prot_1 
        {
            segment seg_1 { ... } 
        } 
        ```

+ ETL元素描述语法

    - 元素描述的语法为: `元素类型 元素名称 { ... }`，类似于程序语言class声明方式
    
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

+ 元素属性

    * 每种元素都具有多个属性
    * 元素属性赋值语法为： ` 属性名称: 属性值 `，类似于JavaScript里的字面量对象
    * 多个元素属性连续赋值时使用逗号分隔，最后一个属性赋值后面的逗号可以省略

        > 举例：协议段 `seg_1` 的解析器属性为8位无符号整数
        ```
        segment seg_1 { parser: 'uint8' } 
        ```
