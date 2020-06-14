
# ETLua API

ETLua API是内置在ETLua执行器中的全局对象和函数，开发时无须导入即可直接使用

## 内置对象

- `protocol` 包含项目内已定义的全部协议描述对象
    - protocol的每个成员对应一个同名的协议定义
- `device` 包含当前拓扑环境中的全部设备描述对象
    - device的每个成员对应一个同名的设备，设备的下级成员是同名的接口组成
- `record` 包含用例执行中的全局数据记录对象
    - record对象对应当前主帧中的数据记录，每个主帧开始时会自动创建新的record对象
    - record对象的成员为需要记录或监控的状态数据，可动态添加或删除任意类型数据

## 基础库

#### print

- 命令行输出文本信息
- 输入参数可变数量
- 任意类型的数据均转为文本输出
- 举例 
    ```
        print("abc") 
        输出abc
    ```

#### exit

- 退出测试程序执行
- 举例
    ```
        function function_name()
            function body
            exit（）
        end
    ```

#### assert

- 执行断言，第一个参数为fasle时退出程序
- 第二个参数为可选的断言失败时的提示信息
- 举例
    ```
        assert(123==123)
        assert(math.isequal(1.0, 1.0))
    ```

#### verify

- 执行判定，并返回判定结果，但不退出程序
- 第二个参数为可选的判定失败时的提示信息
- 举例
    ```
        与assert用法一致，区别在于程序不退出
    ```

#### delay

- 延时指定的 ms 时间
- 参数为正整数
- 举例
    ```
        dealy(1000)
        延时1000毫秒(1秒)
    ```

#### now

- 返回测试程序自启动至当前时长
- 默认返回时长单位是 ms
- 输入可选字符串参数 'ms' 或 'us' 或 'ns' 指定时长单位
- 举例 
    ```
        function Test_now_delay()
            local t1 = now();
            delay(1000)
            local t2 = now()
            print(t2-t1)
        end
    ```

#### error

- 输出一个错误对象
- 测试程序会自动退出


#### message

- 用指定协议创建消息（报文）对象
- 第一个参数指定协议
- 第二个可选参数用于初始化消息内容
- 举例
    ```
        function Test_pack_message()

            local msg1 = message(protocol.prot_1, {seg_1=0xAF} )
            local msg2 = message(protocol.prot_1)
            msg2.seg_1 = 175
            msg1.seg_2 = 0
            print(msg1,msg2)

        end
    ```

#### pack

- pack(msg) 将消息打包
- pack(protocol.xxx, data) 使用指定协议打包数据
- 第一个参数是指定协议，第二个参数为打包的数据
- 返回值是打包后的buffer
- 举例
    ```
        function Test_segments_mathequal()

            local data1 = { token = 0x55aa, point = p}
            local buffer = pack(protocol.prot_point, data1)
            local data2 = unpack(protocol.prot_point,buffer);

        end
    ```

#### unpack

- unpack(protocol.xxx, buffer) 使用指定协议解包buffer
- 第一个参数是指定协议，第二个参数为打包的数据
- 解包成功后返回两个值，第一个返回最值是解包后的数据。第二个返回值，解包使用的字节长度
- 处理粘包问题
- 举例
    ```
        function Test_segments_mathequal()

            local data1 = { token = 0x55aa, point = p}
            local buffer = pack(protocol.prot_point, data1)
            local data2 = unpack(protocol.prot_point,buffer);

        end
    ```

#### send

- 3个输入参数依次为：发送使用的设备接口、str或msg、可选的option
- str可以是字符串也可以是二进制buffer
- msg必须是由message api创建的返回值
- option数据类型必须为对象，用来设置发送数据时的参数选项，不同的接口类型属性不同
- 返回值为整数，对应已发送字节长度
- 举例
    ```
        function Test_send_recv_async()

            local msg = message(protocol.dynamic_len)
            msg.seg1 = 4
            msg.seg2 = {1,2,3, 4}
            send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
            send(device.dev2.uu2,  msg, {to_port=8001})
            local s1, o1 = recv(device.dev2.uu3, nil, 200);
            local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100);

        end

    ```

#### recv

- 用于同步接收数据，用法：`msg, opt = recv(connector, nil|protocol, timeout)`
- 第一个输入参数必须为设备接口
- 第二个输入参数可以为nil或协议，为nil时接收原始字节，为协议时接收协议解析后的报文
- 第三个输入参数指定超时时间，单位ms，默认值0，timeout=0时会立即返回结果
- 返回2个值，第一个值为：string或协议解析后的message，第二个值为：nil或option
- 举例
    ```
        function Test_send_recv_async()

            local msg = message(protocol.dynamic_len)
            msg.seg1 = 4
            msg.seg2 = {1,2,3, 4}
            send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
            send(device.dev2.uu2,  msg, {to_port=8001})
            local s1, o1 = recv(device.dev2.uu3, nil, 200);
            local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100);

        end
    ```

#### write
- 将信号量写入指定接口（DA/DO）
- 第一个输入参数为接口
- 对于DA接口，第二个输入参数为整数
- 对于DO接口，第二个输入参数为布尔值，高电平为true，低电平为false

#### read
- 在指定接口（AD/DI）读取信号量
- 输入参数为接口
- 对于AD接口，返回值为整数
- 对于DI接口，返回值为布尔值，高电平为true，低电平为false

#### nameof
- 获取内置对象名称，输入参数为内置对象或消息对象

#### ask 

- 用于和用户界面进行交互
- 输入参数两个，第一个为交互方式，第二个为交互选项
- 返回值为用户操作结果
- 交互方式包括'ok' 'yesno' 'text' 'number' 'select' 'multiswitch'
- 举例
    ```
        function entry(vars, option)
            --提示用户进行确认
            local answer1 = ask('ok',  {title='提示', msg='确认后继续'})
            print(answer1) ------>'ok'
            
            --提示用户选择是与否
            local answer2 = ask('yesno',  {title='提示', msg='请回答yes或no', default=true})
            print(answer2)------>true|false
        
            --提示用户输入字符串
            local answer3 = ask('text', {title='提示', msg='输入字符串', default='abcd'})
            print(answer3)-------->'abcd'
            
            --提示用户输入数字
            local answer4 = ask('number', {title='提示', msg='输入数字', default=3, min=0, max=100, fixed=2})
            print(answer4)-------->3
        
            --提示用户选择某一项
            local answer4 = ask('select', {title='提示', msg='请选择', default='第一项', items={'第一项','第二项', '第三项'} })
            print(answer4)------------> '第一项'

            local answer5 = ask("multiswitch", 
                        {
                            title = "提示", 
                            msg = "按照以下指示进行开关操作", 
                            items = {
                                {
                                    name = "xxx开关名称1",
                                    value = "x2-34",
                                    on = true,
                                    disabled = true,
                                }, {
                                    name = "xxx开关名称2",
                                    value = "x2-35",
                                    on = false,
                                    disabled = false,
                                }
                            }
                        }
                    )
            print(answer5)------------> ['x2-34']
            exit()
        end
    ```


#### insert

- insert(o) 新增一条完整的数据记录
- insert输入参数必须为table类型的数据

## async库

async库为异步编程api，async中的api执行时均会立即返回，并以异步方式执行

#### async.timeout

- 延时定时器，用法：`id = async.timeout(tout, fn, ...)`
- 指定时间后执行一个函数，返回定时器id
- 第一个参数必须为大于0的数字，指定延时ms数
- 第二个参数必须为函数，后面可以输入可变数量函数执行时的参数
- 举例
    ```
    function Test_timer()

        async.timeout(200, Tout, -199, "aaa")
        local t2 = async.interval(100, 300, Interv, -222, "bbbb")
        local t3 = async.timeout(5000, Tout, 100, "不应该能看到我")
        delay(3000)
        async.clear(t2)
        async.clear(t3)

    end

    ```

#### async.interval

- 周期定时器，用法:`id = async.interval(delay, intv, fn, ...)`
- 延时指定时间后开始周期性执行函数，返回定时器id
- 第一个参数为数字，指定延时ms数
- 第二个参数为大于0的数字，指定间隔周期ms数
- 第三个参数必须为函数，后面可以输入可变数量函数执行时的参数
- 举例
    ```
    function Test_timer()

        async.timeout(200, Tout, -199, "aaa")
        local t2 = async.interval(100, 300, Interv, -222, "bbbb")
        local t3 = async.timeout(5000, Tout, 100, "不应该能看到我")
        delay(3000)
        async.clear(t2)
        async.clear(t3)
        
    end

    ```

#### async.clear

- 清除定时器，用法：`async.clear(id)`
- 清除输入参数id对应的定时器
- 举例
    ```
    function Test_timer()

        async.timeout(200, Tout, -199, "aaa")
        local t2 = async.interval(100, 300, Interv, -222, "bbbb")
        local t3 = async.timeout(5000, Tout, 100, "不应该能看到我")
        delay(3000)
        async.clear(t2)
        async.clear(t3)
        
    end

    ```

#### async.send

- 异步发送，用法：`async.send(connector, msg, option, fn_callback)`
- 比同步send函数的输入参数多一个回调函数
- 回调函数的输入参数与同步send的返回值相同
- 举例
    ```
    function Test_recved_event()

        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        msg.seg1 = 5;
        msg.seg2 = {5,4,3,2,1}
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)

    end
    ```

#### async.recv

- 异步接收，用法：`async.recv(connector, nil|protocol, timeout, fn_callback)`
- 比同步send函数的输入参数多一个回调函数
- 回调函数的输入参数与同步recv的返回值相同
- 举例
    ```
     function Test_send_recv_async()

        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}
        async.send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'}, After_send)
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        async.recv(device.dev2.uu3, nil, 300, After_recv);
        async.recv(device.dev2.uu3, protocol.dynamic_len, 200, After_recv);
       
    end
       
    ```

#### async.on_recv

- 订阅数据到达事件，用法：`async.on_recv(connector, nil|protocol, fn_callback)`
- 举例
    ```
    function Test_recved_event()
   
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}

        async.on_recv(device.dev2.uu3, nil, After_recv)
        delay(100)
        async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv)

        msg.seg1 = 5;
        msg.seg2 = {5,4,3,2,1}

        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        delay(500)
        async.off_recv(device.dev2.uu2)

    end
    ```

#### async.off_recv

- 取消数据到达事件的订阅，用法：`async.off_recv(connector)`
- 举例
    ```
    function Test_recved_event()
   
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}

        async.on_recv(device.dev2.uu3, nil, After_recv)
        delay(100)
        async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv)

        msg.seg1 = 5;
        msg.seg2 = {5,4,3,2,1}

        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        delay(500)
        async.off_recv(device.dev2.uu2)

    end
    ```

## log库

#### log.info

- 记录普通日志信息
- 输出结果为绿色标识
- 举例
    ```
    function Test_log()

        COUNT = COUNT + 1;
        log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
       
    end

    ```

#### log.warn

- 记录警告日志信息
- 输出结果为黄色标识
- 举例
    ```
    function Test_log()
        print('')
        log.warn("log.warn test")
    end

    ```

#### log.error

- 记录错误日志信息
- 输出结果为红色标识
- 举例
    ```
        function Test_log()
            print('')
            log.error("log.error test")
        end
    ```

#### log.step

- 记录测试步骤开始日志
- 举例
    ```
        function Test_log()

            print('')
            log.step("log.step test")
         
        end

    ```

#### log.action

- 记录测试动作执行日志
- 举例
    ```
        function Test_log()
            print('')
            log.action("log.action test") 
        end

    ```

#### log.doing

- 输出正在执行信息
- 通常用于需要长时间执行或等待的任务

#### log.check

- 输出检查结果的日志
- 第一个参数为字符串，第二个参数为布尔值
- 举例
    ```
        function Test_log()
            print('')
            log.check("aaa", true);
        end

    ```


## string库

#### string.tohex

- 将buffer转为16进制字符串

#### string.tobuf

- 将16进制字符串转为buffer

#### string.fromarr

- 将数组数组转为buffer

#### string.byte

- 输出字符串的内部编码
- 输入参数依次为字符串，要输出的开始索引[i]、结束索引[j]
- 默认i=1，j=i

#### string.char

- 输出和参数数量相同长度的字符串
- 参数为零或者更多的整数
- 每个字符的内部编码值等于对应的参数值

#### string.dump

- 输出包含有以二进制方式表示的（一个 二进制代码块 ）指定函数的字符串
- 之后可以用 load 调用这个字符串获得 该函数的副本（但是绑定新的上值）
- 参数1为function， 如果参数2可选，如果为真值， 二进制代码块不携带该函数的调试信息 （局部变量名，行号，等等）

#### string.find

- 查找参数1(字符串)中匹配到的参数2 （参见 §6.4.1）。 
- 如果找到一个匹配，find 会返回参数1中关于它起始及终点位置的索引； 否则，返回 nil 
- 第三个可选数字参数指明从哪里开始搜索； 默认值为 1 ，同时可以是负值
- 第四个可选参数为 true 时， 关闭模式匹配机制， 此时函数仅做直接的 “查找子串”的操作， 而参数2中没有字符被看作魔法字符 
- 注意，如果给定了参数4　，就必须写上参数3

#### string.format

- 输出不定数量参数的格式化版本， 格式化串为第一个参数（必须是一个字符串）
- 格式化字符串遵循 ISO C 函数 sprintf 的规则，不同点在于选项 *, h, L, l, n, p 不支持， 另外还增加了一个选项 q， q 选项将一个字符串格式化为两个双引号括起，对内部字符做恰当的转义处理的字符串该字符串可以安全的被 Lua 解释器读回来
- 例如，调用string.format('%q', 'a string with "quotes" and \n new line')
会产生字符串："a string with \"quotes\" and \new line"

#### string.gmatch

- 输出一个迭代器函数， 每次调用这个函数都会继续以参数2对参数1做匹配，并返回所有捕获到的值 
- 如果参数2中没有指定捕获，则每次捕获整个参数2

#### string.gsub

- 将参数1(字符串)中，所有的（或是在参数4给出时的前参数4(参数4为可选参数)个）参数2都替换成参数3 ，并输出
- 参数3 可以是字符串、表、或函数，gsub 还会在第二个返回值返回一共发生了多少次匹配
- 如果参数3是一个字符串，那么把这个字符串作为替换品。 字符 % 是一个转义符：
- 参数3中的所有形式为 %d 的串表示 第 d 个捕获到的子串，d可以是1到9，串%0表示整个匹配，串%%表示单个%
- 如果参数3是张表，每次匹配时都会用第一个捕获物作为键去查这张表
- 如果参数3是个函数，则在每次匹配发生时都会调用这个函数,所有捕获到的子串依次作为参数传入
- 任何情况下，模板中没有设定捕获都看成是捕获整个模板
- 如果表的查询结果或函数的返回结果是一个字符串或是个数字， 都将其作为替换用串； 而在返回 false 或 nil　时不作替换 （即保留匹配前的原始串）

#### string.len

- 参数为一个字符串
- 输出其长度
- 空串 "" 的长度为 0 
- 内嵌零也统计在内，因此 "a\000bc\000" 的长度为 5 

#### string.lower

- 参数为一个字符串
- 将其中的大写字符都转为小写后输出
- 其它的字符串不会更改，对大写字符的定义取决于当前的区域设置

#### string.match

- 在参数1(字符串)中找到第一个能用参数2匹配到的部分
- 如果能找到，输出其中的捕获物； 否则返回 nil 
- 如果参数2中未指定捕获， 输出整个参数2捕获到的串
- 第三个可选数字参数，指明从哪里开始搜索； 它默认为1，可以是负数

#### string.pack 

- 输出一个打包了（即以二进制形式序列化） 参数2, 参数3等值的二进制字符串
- 参数1(字符串)为打包格式

#### string.packsize

- 输出以指定格式用 string.pack 打包的字符串的长度
- 格式化字符串中不可以有变长选项 's' 或 'z'

#### string.rep

- 输出 参数2(正数) 个参数1(参数1) 以参数3(字符串)为分割符连在一起的字符串
- 默认的参数3值为空字符串（即没有分割符）
- 如果参数2不是正数则返回空串

#### string.reverse

- 输出字符串的翻转串
- 输入参数为字符串

#### string.sub

- 输出参数1的子串， 该子串从参数2开始到参数3为止； 参数2 和 参数3 都可以为负数。 如果不给出参数3 ，就当它是 -1 （和字符串长度相同） 
- 调用 string.sub(参数1,1,参数3) 可以返回参数1的长度为参数3 的前缀串， 而 string.sub(参数1, -参数2) 返回长度为参数2的后缀串。
- 如果在对负数索引转义后参数2小于 1 的话，就修正回 1  
- 如果参数3比字符串的长度还大，就修正为字符串长度 
- 如果在修正之后，参数2大于参数3， 函数返回空串。

#### string.unpack

- 输出以格式参数1打包在参数2(字符串)中的值
- 选项参数3（默认为 1 ）标记了从参数2中哪里开始读起。 读完所有的值后，函数返回参数2中第一个未读字节的位置。

#### string.upper

- 输入参数为一个字符串 
- 将其中的小写字符都转为大写后输出 
- 其它的字符串不会更改，对小写字符的定义取决于当前的区域设置

## math库

#### math.abs 

- 输出参数的绝对值(integer/float)

#### math.acos 

- 输出参数的反余弦值（用弧度表示）

#### math.asin

- 输出参数的反正弦值（用弧度表示）

#### math.atan

- 输出 参数1/参数2（参数2为可选参数）的反正切值（用弧度表示）。 
- 它会使用两个参数的符号来找到结果落在哪个象限中（即使参数2为零时，也可以正确的处理）
- 默认的参数2是 1 ，因此调用 math.atan(参数1) 将返回参数1的反正切值

#### math.ceil

- 输出不小于参数的最小整数值

#### math.cos

- 输出参数的余弦（假定参数是弧度）

#### math.deg 

- 将角 参数 从弧度转换为角度

#### math.exp

- 输出 e的x次方(假定参数为x) 的值（e 为自然对数的底）

#### math.floor 

- 输出不大于参数的最大整数值

#### math.fmod 

- 返回参数1除以参数2，将商向零圆整后的余数。 (integer/float)

#### math.huge

- 浮点数 HUGE_VAL， 这个数比任何数字值都大

#### math.log

- 返回以指定底的 参数1 的对数，默认的参数2是e（因此此函数返回参数1 的自然对数）

#### math.max 

- 返回参数中最大的值， 大小由 Lua 操作 < 决定(integer/float)

#### math.maxinteger

- 最大值的整数

#### math.min 

- 输出参数中最小的值， 大小由 Lua 操作 < 决定(integer/float)

#### math.mininteger

- 最小值的整数

#### math.modf

- 输出参数的整数部分和小数部分，第二个结果一定是浮点数

#### math.pi

- π 的值

#### math.rad

- 将角 (参数) 从角度转换为弧度

#### math.random

- 当不带参数调用时， 返回一个 [0,1) 区间内一致分布的浮点伪随机数。 
- 当以两个整数 m 与 n 调用时， math.random 返回一个 [m, n] 区间 内一致分布的整数为随机数（值 n-m 不能是负数，且必须在 Lua 整数的表示范围内）
- 调用 math.random(n) 等价于 math.random(1,n)
- 这个函数是对 C 提供的位随机数函数的封装。 对其统计属性不作担保

#### math.randomseed 

- 把 参数 设为伪随机数发生器的“种子”： 相同的种子产生相同的随机数列

#### math.sin

- 输出参数的正弦值（假定参数是弧度）

##### math.sqrt

- 输出参数的平方根（你也可以使用乘方 参数^0.5 来计算这个值）

#### math.tan

- 输出参数的正切值（假定参数是弧度）

#### math.tointeger 

- 如果参数可以转换为一个整数， 返回该整数 否则返回 nil

#### math.type 

- 如果参数是整数，返回 "integer" 
- 如果是浮点数，返回 "float"
- 如果不是数字，返回 nil

#### math.ult

- 如果整数参数1和 参数2 以无符号整数形式比较， 参数1在 参数2 之下，返回布尔真否则返回假

#### math.isequal(f1, f2, is_double)

- 判定两个浮点数是否相等
- 第三个可选参数为布尔型，true：double方式比较， false：float方式比较
- 默认按float方式比较




## table库

#### table.concat (list [, sep [, i [, j]]])

- 提供一个列表，其所有元素都是字符串或数字，返回字符串 list[i]..sep..list[i+1] ··· sep..list[j]。 sep 的默认值是空串， i 的默认值是 1 ， j 的默认值是 #list 。 如果 i 比 j 大，返回空串。

#### table.insert (list, [pos,] value)
- 在 list 的位置 pos 处插入元素 value ， 并后移元素 list[pos], list[pos+1], ···, list[#list] 。 pos 的默认值为 #list+1 ， 因此调用 table.insert(t,x) 会将 x 插在列表 t 的末尾。

#### table.move (a1, f, e, t [,a2])
- 将元素从表 a1 移到表 a2。 这个函数做了次等价于后面这个多重赋值的等价操作： a2[t],··· = a1[f],···,a1[e]。 a2 的默认值为 a1。 目标区间可以和源区间重叠。 索引 f 必须是正数。

#### table.pack (···)
- 返回用所有参数以键 1,2, 等填充的新表， 并将 "n" 这个域设为参数的总数。 注意这张返回的表不一定是一个序列。

#### table.remove (list [, pos])
- 移除 list 中 pos 位置上的元素，并返回这个被移除的值。 当 pos 是在 1 到 #list 之间的整数时， 它向前移动元素　list[pos+1], list[pos+2], ···, list[#list] 并删除元素 list[#list]； 索引 pos 可以是 #list + 1 ，或在 #list 为 0 时可以是 0 ； 在这些情况下，函数删除元素 list[pos]。

- pos 默认为 #list， 因此调用 table.remove(l) 将移除表 l 的最后一个元素。

#### table.sort (list [, comp])
- 在表内从 list[1] 到 list[#list] 原地 对其间元素按指定次序排序。 如果提供了 comp ， 它必须是一个可以接收两个列表内元素为参数的函数。 当第一个元素需要排在第二个元素之前时，返回真 （因此 not comp(list[i+1],list[i]) 在排序结束后将为真）。 如果没有提供 comp， 将使用标准 ETlua 操作 < 作为替代品。

- 排序算法并不稳定； 即当两个元素次序相等时，它们在排序后的相对位置可能会改变。

#### table.unpack (list [, i [, j]])

- 返回列表中的元素。 这个函数等价于
`
return list[i], list[i+1], ···, list[j]
`
i 默认为 1 ，j 默认为 #list

## utf8库

#### utf8.char (···)

- 接收零或多个整数， 将每个整数转换成对应的 UTF-8 字节序列，并返回这些序列连接到一起的字符串。

#### utf8.charpattern

- 用于精确匹配到一个 UTF-8 字节序列的模式（是一个字符串，并非函数）"[\0-\x7F\xC2-\xF4][\x80-\xBF]*" 。 它假定处理的对象是一个合法的 UTF-8 字符串。

#### utf8.codes (s)

- 返回一系列的值，可以让`for p, c in utf8.codes(s) do body end`迭代出字符串 s 中所有的字符。 这里的 p 是位置（按字节数）而 c 是每个字符的编号。 如果处理到一个不合法的字节序列，将抛出一个错误。

#### utf8.codepoint (s [, i [, j]])

- 以整数形式返回 s 中 从位置 i 到 j 间（包括两端） 所有字符的编号。 默认的 i 为 1 ，默认的 j 为 i。 如果碰上不合法的字节序列，抛出一个错误。

#### utf8.len (s [, i [, j]])

- 返回字符串 s 中 从位置 i 到 j 间 （包括两端） UTF-8 字符的个数。 默认的 i 为 1 ，默认的 j 为 -1 。 如果它找到任何不合法的字节序列， 返回假值加上第一个不合法字节的位置。

#### utf8.offset (s, n [, i])

- 返回编码在 s 中的第 n 个字符的开始位置（按字节数） （从位置 i 处开始统计）。 负 n 则取在位置 i 前的字符。 当 n 是非负数时，默认的 i 是 1， 否则默认为 #s + 1。 因此，utf8.offset(s, -n) 取字符串的倒数第 n 个字符的位置。 如果指定的字符不在其中或在结束点之后，函数返回 nil。
作为特例，当 n 等于 0 时， 此函数返回含有 s 第 i 字节的那个字符的开始位置。

- 这个函数假定 s 是一个合法的 UTF-8 字符串


