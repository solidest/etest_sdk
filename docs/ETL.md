
# ETL简介
ETL (Embedded Test Language)是专用于开发嵌入式测试程序的语言，采用ETL编写的测试程序可在ETL运行器上直接执行

## ETL组成结构
![ETL组成结构](https://solidest.github.io/etest_sdk/ETL_Topo.svg)

+ `ETL`使用简洁易懂的语法描述测试程序的环境组成和执行脚本，包括：
    - `device` 设备接口描述
    - `topology` 连接拓扑描述
    - `protocol` 通信协议描述
    - `panel` 操作面板描述
    - `ETLua` 测试执行脚本语言

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
* `panel`：操作面板描述
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

## 设备接口描述

+ 设备描述使用`device`进行定义，如: `device dev_name { ... }`
+ 设备接口描述只能出现在设备描述内部，使用接口类型关键字进行定义，如 `udp connector_name { ... }`
+ 接口参数设置在接口内部以键值对的方式进行描述

### 接口类型及参数

+ `udp` upd协议接口
    - 参数`ip`用于指定udp通信的ip地址
    - 参数`port`用于指定udp通信端口
    - 参数`ttl`用于指定路由传输的存活周期

+ `tcp_client` tcp协议客户端
+ `tcp_server` tcp通信协议服务端
+ `serial_ttl` TTL串口
+ `serial_232` 232串口
+ `serial_422` 422串口
+ `serial_485` 485串口
+ `di` 数字输入
+ `do` 数字输出
+ `ad` 模数转换接口
+ `da` 数模转换接口

### 示例
    > 举例：包含多个接口的设备

    ```
    device dev_0 {
        udp srv_1 { ip: '127.0.0.1', port: 3000, ttl: 20 }
        tcp_client clt_2 { ip: '127.0.0.1' }
        tcp_server srv_2 { ip: '127.0.0.1', port: 3000 }

        udp clt_1 { ip: '127.0.0.1', prot: 8888 }
        udp udp_name {ip: '0.0.0.0', port: 8888}

        //baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控
        serial_ttl s1 { baudrate: 9600, databits: 6, stopbits: 1.5, xonxoff: true, rtscts: true }
        serial_232 s2 { baudrate: 9600 }
        serial_422 s3 { baudrate: 9600 }
        serial_485 s4 { baudrate: 9600 }
    
        di di1 { minv: 3, maxv: 5 }
        do do1 { minv: 3, maxv: 5 }

        //ratio 分辨率；
        da da1 { ratio: 8, minv: 0, maxv: 24 }
        ad ad1 { ratio: 16, minv: 0, maxv: 12 }
    }
    ```

## 连接拓扑描述

- 连接拓扑描述测试环境中设备接口之间的连接关系
- 连接拓扑描述使用关键字`topology`进行定义
- 同一个项目内允许定义多个名称不同的 `topology`
- `topology`内部描述由3各固定的匿名元素组成 `lingking`、`mapping`和`binding`

### linking

- `linking` 描述接口之间的连接关系，每个连接均为一个键值对，连接名称是键，连接组成是设备接口引用数组
- 连接名称允许重复

    > 连接描述举例：
    ```
    //接口之间的连接
    linking: {
        bus_1: [dev_1.s1, dev2.s1, dev_2.s1, dev_3.clt_1],   //总线
        link_1: [dev_3.srv_2, dev_2.srv_2], //点到点连接
        _: [dev_2.clt_1, dev_1.clt_1],
        _: [dev_3.s1, dev_3.s2, dev_2.s3], //总线
        link_3: [],
        link_4: [dev_1.ad1, dev_3.da1],
    }
    ```

### mapping

- `mapping` 描述设备映射关系，由2个固定的匿名元素组成：`uut`和`etest`，分别用于指定待测设备和etest仿真设备

    > 设备映射描述举例：
    ```
    //设备映射
    mapping: {
        uut: [dev_2, dev_1],   //被测硬件单元
        etest: [dev_4, dev_3],   //etest仿真设备
    }
    ```

### binding

+ `binding` 描述etest仿真设备接口和etest物理主机接口卡之间的绑定关系

    > 接口绑定举例：

    ```
    //接口绑定
    binding: {
        dev2.s1: 'auto',
        dev_3.s1: 'com2@192.168.1.5',
        dev_3.clt_1: 'can_a:1@192.168.1.5',
    }
    ```
   
### 示例

- 包含完整元素的连接拓扑示例：
    
    ```
    topology topo_1 {

            //接口之间的连接
            linking: {
                bus_1: [dev_1.s1, dev2.s1, dev_2.s1, dev_3.clt_1],   //总线
                link_1: [dev_3.srv_2, dev_2.srv_2], //点到点连接
                _: [dev_2.clt_1, dev_1.clt_1],
                _: [dev_3.s1, dev_3.s2, dev_2.s3], //总线
                link_3: [],
                link_4: [dev_1.ad1, dev_3.da1],
            }

            //设备映射
            mapping: {
                uut: [dev_2, dev_1],   //被测硬件单元
                etest: [dev2, dev_3], //软设备
            }

            //接口绑定
            binding: {
                dev2.s1: 'auto',
                dev_3.s1: 'com2@192.168.1.5',
                dev_3.clt_1: 'can_a:1@192.168.1.5',
            }
    }
    ```

## 通信协议描述

- 用于描述通信报文格式，使用关键字 `protocol`
- 协议名称在同一项目内必须唯一
- 定义协议时在`protocol`关键字之前，可以使用协议修饰字

### 协议修饰字

+ `bitrl` 指定协议内协议段的位序为从右至左（低位在前）
+ `bitlr` 指定协议内协议段的位序为从左至右（高位在前）

![协议段的位序](http://assets.processon.com/chart_image/5ce8d3abe4b040c85aec5023.png)


### 协议元素

+ 协议内部可以描述的元素包括：

    * `segment` 协议段，由协议段名称和协议段属性组成
    * `segments` 协议组，由协议组名称和子级协议段组成
    * `oneof` 协议分支，由判定条件和分支协议段组成

    > 举例：包括各类元素的协议

        ```
        prototcol prot_1 
        {
            //协议段
            segment msg_type { ... } 

            //协议组
            segments point {
                segment x { ... }
                segment y { ... }
            }

            //协议分支
            oneof(this.msg_type == 1) {

                //分支协议段
                ....
            }

            oneof(this.msg_type == 2) {
                ....
            }

            //协议段
            segment tail { ... }
        } 
        ```

### 协议段引用

+ 协议段属性赋值时可以使用 `this.seg_name` 的方式来引用其它协议段
+ 在计算表达式中使用协议段引用时等同于使用对应协议段的值

### 协议内置函数

+ `ByteSize` 函数接收一个协议段引用，返回协议段的字节长度
+ `CheckCode` 函数用于计算校验值
    * CheckCode接收3个参数，依次为校验函数、校验开始协议段、校验结尾协议段
    * 后两个参数为可选参数，默认从协议第一个协议段开始，至校验码字段的前一个协议段结束
    * 第一个参数有三种赋值方式：[内置校验函数](###内置校验函数)名、用户自定义校验函数名、CRC描述(数组方式)
    * CRC描述使用数组的方式描述CRC算法，数组前3个值为数字，后2个值为布尔值，依次为 `[多项式值, CRC初始值, 结果异或值, 是否反转输入, 是否反转输出]`

        > 举例：32位CRC校验字段设置
        ```
        ....

        segment seg_crc1 { 
            parser: 'uin32', 
            autovalue: CheckCode([0x04C11DB7, 0xFFFFFFFF, 0xFFFFFFFF, true, true], this.seg_begin, this.seg_end)
        }

        ....

        segment seg_crc2 { 
            parser: 'uin32', 
            autovalue: CheckCode(CRC_32, this.seg_begin)
        }

        ```

### 空协议段
+ 可以定义只有名称，无任何属性的空协议段
+ 空协议段在解析时将被忽略
+ 空协议段可以用来标识字节流位置
+ 空协议段可以用来分割连续的`oneof`分支


### 协议段 `segment` 

#### `parser`解析器属性

+ 描述协议段的解析方式，有两种赋值方式：解析字符串、自定义解析对象

+ 可用的解析字符串包括:

    - 数据类型：`int1` ~ `int64`、`uint1` ~ `uint64`、`float`、`double`、`string`
    - 大端序：`>`
    - 小端序：`<` 
    - 反码：`!`
    - 补码：`&`
    - 默认使用主机本地字节序的原码

    > 举例：描述多个协议段
    
    ```
    protocol prot_1 {
        segment seg_1 { parser: 'uint2' }
        segment seg_2 { parser: 'uint20' }
        segment seg_3 { parser: 'uint10' }
        segment seg_4 { parser: 'float > !' }
    }
    ```

+ 自定义解析对象内包含`pack`、`unpack`两个属性，分别用于指定用户自定义的打包函数名和解包函数名

    > 举例：使用自定义解析对象的字段

    ```
    protocol prot_1 {

        segment seg_1 {
            parser: { pack: MyPackFn, unpack: MyUnpackFn } 
        }

    }
    ```

#### `autovalue` 自动赋值属性

+ 当报文数据打包时，如果对应协议段的值为空，则解析器自动使用`autovalue`属性值打包
+ `autovalue`属性值可以设置为常量、数组、协议段引用、内置函数调用或计算表达式
+ 当报文数据打包时，如果对应协议段已经赋值，该属性会被解析器忽略

#### `length` 字符串长度属性

+ 用于设置解包时字符串类型协议段的字节长度
+ `lenght`属性值可以为常数、协议段引用或计算表达式

#### `endwith` 字符串结尾标识

+ 用于设置识别字符串结尾标识的字符片段
+ 如果已经设置`length`属性，该属性将被解析器忽略
+ 如果`length`属性和 `endwith`属性均没有设置，则解析器使用`'\0'`做为`endwith`的值进行解析

### 协议组 `segments`

+ 协议组用于将多个协议段组合在一起，并使用相同的父级对象名
+ 协议组可以多层嵌套使用
+ 协议组可以设置为数组类型

    > 举例：表示连续100个坐标点的协议描述

    ```
    protocol prot_1 {

        segment HEADER { parser: 'uint16', autovalue: 0x55AA }

        segments POS[100] {
            segment X { parser: 'float' }
            segment Y { parser: 'float' }
        }   

    }
    ```


### 协议分支 `oneof`

+ 当`oneof`判定条件计算结果为`true`时，解析器进入分支内部进行解析

+ 当`oneof`判定条件计算结果为`false`时，跳过该分支

+ 连续多个`oneof`分支，解析器只会解析第一个判定条件为`true`的分支

    > 举例：
    ```
    protocol prot_oneof {
        segment type1 { parser: 'int8' }
        segment type2 { parser: 'int8', autovalue: this.type1*2 }
        oneof(this.type1 == 2) {  //解析为二维坐标
            segment x { parser: 'float' }
            segment y { parser: 'float' }
        }
        oneof(this.type1 == 3) {  //解析为三维坐标
            segment x { parser: 'float' }
            segment y { parser: 'float' }
            segment z { parser: 'float' }
        }
        segment none {  } //设置一个空协议段以分割出两组连续的oneof分支
        oneof(this.type2 <= 2) {
            segment x1 { parser: 'float', autovalue: 9.8 }
        }
        oneof(this.type2 == 2*this.type1) {
            segment x2 { parser: 'double' }
        }
        segment tail { parser: 'int8', autovalue: 2*(1+this.type1)}
    }
    ```


### 协议段数组 `[ ]` 

+ `segment` 和 `segments` 均可设置为数组
+ 在协议段名称后跟 `[ ]` 来标识数组
+ 中括号内为数组的长度，长度值可以为常数、协议段引用或计算表达式

    > 举例：动态长度的协议段 seg_arr
    ```
    protocol prot_1 {

        segment seg_len { parser: 'int32', autovalue: ByteSize(this.seg_arr) }

        segment seg_arr[this.seg_len] { parser: 'uint8' }

    }
    ```

### 自定义解析

#### 自定义打包函数

+ 协议段打包时调用
+ 输入参数 seg_name: 协议段名称、seg_value：协议段值
+ 返回值：返回打包后的string

    >举例：将浮点数打包成字符串 字符D替换小数点

    ```
    function PackFloat_D(seg_name, seg_value)
        local str = string.format("%.5f", seg_value)
        if seg_name=='WD' then  注：纬度是最后一个字符串，不需要分割符F
            return string.gsub(str, "%.", "D")
        else 
            return string.gsub(str, "%.", "D")..'F'
        end
    end
    ```

#### 自定义解包函数

+ 协议段解包时调用
+ 输入参数 seg_name: 协议段名称、prot_buff：报文原始字节、 pos: 当前解析位置
+ 返回值：必须返回2个值，第1个为解析得到的值，第2个为解析使用的字节长度

    >举例：将含D字符的string解包成浮点数
    ```
    function UnpackFloat_D(seg_name, prot_buff, pos)
        local pos_end = pos
        local str = ''

        if seg_name=='WD' then
            pos_end = string.len(prot_buff)
            str = string.sub(prot_buff, pos, pos_end)
        else 
            pos_end = string.find(prot_buff, 'F', pos)
            str = string.sub(prot_buff, pos, pos_end-1)
        end
        str = string.gsub(str, 'D', '.')
        return tonumber(str), pos_end-pos+1
    end
    ```

#### 自定义校验函数

+ 校验函数用于生成原始字节的校验码
+ 输入参数 prot_buff: 协议包原始字节、pos_begin：校验开始字节位置、pos_end：校验结束字节位置
+ 返回值：返回特定长度字符串

    > 举例：xor8校验后转字符串
    ```
    function My_xor8(prot_buff, pos_begin, pos_end)
        local res = 0
        for i=pos_begin, pos_end do
            res = res ~ string.byte(prot_buff, i)
        end
        return string.format("%02X", res)
    end
    ```

### 内置校验函数

#### 普通校验函数

名称|说明
-|-
SUM_8 | 8位校验和
XOR_8 | 8位异或值
SUM_16 | 16位校验和，低字节在前，高字节在后
SUM_16_FALSE | 16位校验和，高字节在前，低字节在后
XOR_16 | 16位异或值，低字节在前，高字节在后
XOR_16_FALSE | 16位异或值，高字节在前，低字节在后
SUM_32 | 32位校验和，低字节在前，高字节在后
SUM_32_FALSE | 32位校验和，高字节在前，低字节在后
XOR_32 | 32位异或值，低字节在前，高字节在后
XOR_32_FALSE | 32位异或值，高字节在前，低字节在后


#### 循环冗余校验函数

名称|多项式|初始值|结果异或值|反转输入|反转输出
-|-|-|-|-|-|
CRC_4_ITU |0x3| 0x0| 0x0| true| true|
CRC_5_EPC | 0x09| 0x09| 0x00| false| false |
CRC_5_ITU | 0x15| 0x00| 0x00| true| true |
CRC_5_USB | 0x05| 0x1F| 0x1F| true| true |
CRC_6_ITU | 0x03| 0x00| 0x00| true| true |
CRC_6_CDMA2000A |0x27| 0x3F| 0x00| false| false |
CRC_6_CDMA2000B | 0x07| 0x3F| 0x00| false| false |
CRC_7 |0x09| 0x00| 0x00| false| false |
CRC_8 |0x07| 0x00| 0x00| false| false |
CRC_8_EBU | 0x1D|0xFF| 0x00| true| true |
CRC_8_MAXIM | 0x31| 0x00| 0x00| true| true |
CRC_8_WCDMA | 0x9B| 0x00| 0x00| true| true  |
CRC_10 | 0x233| 0x000| 0x000| false| false|
CRC_10_CDMA2000 | 0x3D9| 0x3FF| 0x000| false| false |
CRC_11 | 0x385| 0x01A| 0x000| false| false |
CRC_12_CDMA2000 | 0xF13| 0xFFF| 0x000| false| false |
CRC_12_DECT | 0x80F| 0x000| 0x000|false| false |
CRC_12_UMTS | 0x80F| 0x000| 0x000| false| true |
CRC_13_BBC |0x1CF5| 0x0000| 0x0000| false| false |
CRC_15 | 0x4599| 0x0000| 0x0000| false| false |
CRC_15_MPT1327 | 0x6815| 0x0000| 0x0001| false| false |
CRC_16_ARC | 0x8005| 0x0000| 0x0000| true| true |
CRC_16_BUYPASS |0x8005| 0x0000| 0x0000| false| false |
CRC_16_CCITTFALSE | 0x1021| 0xFFFF| 0x0000| false| false |
CRC_16_CDMA2000 |0xC867| 0xFFFF| 0x0000| false| false |
CRC_16_CMS | 0x8005| 0xFFFF| 0x0000| false| false |
CRC_16_DECTR | 0x0589| 0x0000| 0x0001| false| false|
CRC_16_DECTX |0x0589| 0x0000| 0x0000| false| false |
CRC_16_DNP | 0x3D65| 0x0000| 0xFFFF| true|true |
CRC_16_GENIBUS | 0x1021 |0xFFFF| 0xFFFF| false| false |
CRC_16_KERMIT |0x1021|0x0000| 0x0000| true| true |
CRC_16_MAXIM | 0x8005| 0x0000| 0xFFFF| true| true |
CRC_16_MODBUS | 0x8005| 0xFFFF| 0x0000| true| true |
CRC_16_T10DIF |0x8BB7| 0x0000| 0x0000| false| false |
CRC_16_USB |0x8005| 0xFFFF| 0xFFFF| true| true |
CRC_16_X25 | 0x1021| 0xFFFF| 0xFFFF| true|true |
CRC_16_XMODEM | 0x1021| 0x0000| 0x0000| false| false |
CRC_17_CAN | 0x1685B| 0x00000| 0x00000| false| false|
CRC_21_CAN | 0x102899| 0x000000| 0x000000| false| false|
CRC_24 | 0x864CFB|0xB704CE| 0x000000| false| false|
CRC_24_FLEXRAYA |0x5D6DCB| 0xFEDCBA| 0x000000| false| false|
CRC_24_FLEXRAYB | 0x5D6DCB| 0xABCDEF| 0x000000| false| false  |
CRC_30 | 0x2030B9C7| 0x3FFFFFFF| 0x00000000| false|false |
CRC_32 | 0x04C11DB7|0xFFFFFFFF|0xFFFFFFFF| true| true |
CRC_32_BZIP2 |0x04C11DB7| 0xFFFFFFFF| 0xFFFFFFFF| false|false| 
CRC_32_C | 0x1EDC6F41| 0xFFFFFFFF| 0xFFFFFFFF| true| true |
CRC_32_MPEG2 | 0x04C11DB7| 0xFFFFFFFF | 0x00000000  | false| false |
CRC_32_POSIX |0x04C11DB7 | 0x00000000| 0xFFFFFFFF| false|false |
CRC_32_Q | 0x814141AB | 0x00000000| 0x00000000 | false| false |
CRC_40_GSM | 0x0004820009|0x0000000000|0xFFFFFFFFFF| false|false|
CRC_64 | 0x42F0E1EBA9EA3693| 0x0000000000000000 | 0x0000000000000000| false| false|





## ETLua
ETLua 是开发测试程序的执行脚本时使用的编程语言，详细介绍参见 `ETLua`章节
