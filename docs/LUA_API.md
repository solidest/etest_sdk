
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

    ```lua
    print("abc") 
    --输出abc
    ```

#### exit

- 退出测试程序执行
- 举例
    ```lua
    function function_name()
        function body
        exit()
    end
    ```

#### assert

- 执行断言，第一个参数为fasle时退出程序
- 第二个参数为可选的断言失败时的提示信息
- 举例
    ```lua
    assert(123==123)
    assert(1==2,"断言出错")
    assert(math.isequal(1.0, 1.0))
    ```

#### verify

- 执行判定，并返回判定结果，但不退出程序
- 第二个参数为可选的判定失败时的提示信息
- 与assert用法一致，区别在于程序不退出

#### delay

- 延时指定的 ms 时间
- 参数为正整数
- 举例
    ```lua
    print("aaa")
    dealy(1000)
    --延时1000毫秒(1秒)
    print("bbb")
    ```

#### now

- 返回测试程序自启动至当前时长
- 默认返回时长单位是 ms
- 输入可选字符串参数 'ms' 或 'us' 或 'ns' 指定时长单位
- 默认参数为 ms 毫秒
- 举例 
    ```lua
    function Test_now_delay()
        local t1 = now()
        delay(1000)
        local t2 = now()
        print(t2-t1)
    end
    ```

#### error

- 输出一个错误对象
- 测试程序会自动退出
- 举例 
    ```lua
    function Test_error()
        print("检测error")
        error("错误退出")--程序退出
        print("执行失败")
    end
    ```


#### message

- 用指定协议创建消息（报文）对象
- 第一个参数指定协议
- 第二个可选参数用于初始化消息内容
- 有两种创建消息的方式
- protocol.prot_1 为自定义的协议，具体定义方式见ETL语法入门，这里不做详细介绍
- 举例
    ```lua
    function Test_pack_message()
        -- 方式一
        local msg1 = message(protocol.prot_1, {seg_1=0xAF})
        -- 方式二
        local msg2 = message(protocol.prot_1)
        msg2.seg_1 = 175
        msg1.seg_2 = 0
        print(msg1,msg2)
    end
    ```

#### pack

- pack(msg, strict) 将消息打包
- pack(protocol.xxx, data, strict) 使用指定协议打包数据
- 第一个参数是指定协议，第二个参数为打包的数据
- strict指定是否需要严格匹配协议段，缺省值为true(多用于协议分支oneof,oneof后面做介绍)
- 返回值是打包后的buffer
- protocol.prot_point为自定义的协议，定义方式见ETL语法入门
- 举例
    ```lua
    function Test_pack()
        local data1 = { token = 0x55aa, point = "p"}
        local buffer = pack(protocol.prot_point, data1, true)
        local data2 = unpack(protocol.prot_point,buffer)
        print(data1,data2)
        assert(data1["token"] == data2["token"])
    end
    ```

#### unpack

- unpack(protocol.xxx, buffer) 使用指定协议解包buffer
- 第一个参数是指定协议，第二个参数为打包的数据
- 解包成功后返回两个值，第一个返回最值是解包后的数据。第二个返回值，解包使用的字节长度
- 解包后可用一个变量接收返回的数据
- 处理粘包问题
- protocol.prot_point为自定义的协议，定义方式见ETL语法入门
- 举例
    ```lua
    function Test_unpack()
        local data1 = { token = 0x55aa, point = "p"}
        local buffer = pack(protocol.prot_point, data1)
        local data2 = unpack(protocol.prot_point,buffer)
        print(data1,data2)
    end
    ```

#### send

- 3个输入参数依次为：发送使用的设备接口、str或msg、可选的option
- str可以是字符串也可以是二进制buffer
- msg必须是由message api创建的返回值
- option数据类型必须为对象，用来设置发送数据时的参数选项，不同的接口类型属性不同
- 以下例子中的option参数为发送到dev2设备的uu3接口(定义方式见ETL中的连接拓扑描述)
- 返回值为整数，对应已发送字节长度
- protocol.dynamic_len  为自定义的协议，定义方式见ETL语法入门
- 举例
    ```lua
    function Test_send()
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1, 2, 3, 4}
        -- 指定设备接口进行发送
        send(device.dev2.uu2,  'abcd\0', {to = 'dev2.uu3'})
        send(device.dev2.uu2,  msg, {to = 'dev2.uu3'}})
        local s1, o1 = recv(device.dev2.uu3, nil, 200);
        local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100)
    end

    ```

#### recv

- 用于同步接收数据，用法：`msg, opt = recv(connector, nil|protocol, timeout)`
- 第一个输入参数必须为设备接口
- 第二个输入参数可以为nil或协议，为nil时接收原始字节，为协议时接收协议解析后的报文
- 第三个输入参数指定超时时间，单位ms，默认值0，timeout=0时会立即返回结果
- 返回2个值，第一个值为：string或协议解析后的message，第二个值为：nil或option
- protocol.prot_point为自定义的协议，定义方式见ETL语法入门
- 举例
    ```lua
    function Test_recv()
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}
        send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
        send(device.dev2.uu2,  msg, {to_port=8001})
        local s1, o1 = recv(device.dev2.uu3, nil, 200);
        local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100)
    end
    ```
#### ioctl

- 执行同步控制指令
- 输入参数为设备接口、控制指令名称、table类型的指令参数
- 返回值为table类型的指令执行结果
- 举例：
    ```lua
    -- 手动建立到服务器的连接
    local result = ioctl(device.tcp_pc1.client1, 'connect', { to = 'tcp_server1.srv1' })
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

#### ask 

- 用于和用户界面进行交互
- 输入参数两个，第一个为交互方式，第二个为交互选项
- 返回值为用户操作结果
- 交互方式包括'ok' 'yesno' 'text' 'number' 'select' 'multiswitch'
- 举例
    ```lua
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

- insert(table) 新增一条完整的数据记录
- insert输入参数必须为table类型的数据

## async库

async库为异步编程api，async中的api执行时均会立即返回，并以异步方式执行

#### async.timeout

- 延时定时器，用法：`id = async.timeout(tout, fn, ...)`
- 指定时间后执行一个函数，返回定时器id
- 第一个参数必须为大于0的数字，指定延时ms数
- 第二个参数必须为函数，后面可以输入可变数量函数执行时的参数
- 举例
    ```lua
    function Tout(a1, a2)
        print('timeout', a1, a2)
    end
    
    function Interv(a1, a2)
        print('interval', a1, a2)
    end
    
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
- 举例同async.timeout

#### async.clear

- 清除定时器，用法：`async.clear(id)`
- 清除输入参数id对应的定时器
- 举例同async.timeout

#### async.send

- 异步发送，用法：`async.send(connector, msg, option, fn_callback)`
- 比同步send函数的输入参数多一个回调函数
- 回调函数的输入参数与同步send的返回值相同
- protocol.dynamic_len为自定义的协议，定义方式见ETL语法入门
- After_send为回调函数
- 举例
    ```lua
    --异步发送的回调函数
    function After_send(len)
        print("send len", len)
    end
    --异步接收的回调函数
    function After_recv(msg, opt)
        print("recved", msg, opt)
    end
    --发送与接收的函数
    function Test_send_recv_async()
        --构造消息报文
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}
        --异步发送与同步发送
        async.send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'}, After_send)
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
        send(device.dev2.uu2,  msg, {to='dev2.uu3'})
        async.send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'}, After_send)
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        --异步接收与同步接收
        async.recv(device.dev2.uu3, nil, 300, After_recv);
        async.recv(device.dev2.uu3, protocol.dynamic_len, 200, After_recv);
        local s1, o1 = recv(device.dev2.uu3, nil, 200);
        local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100);
        async.recv(device.dev2.uu3, nil, 300, After_recv);
        async.recv(device.dev2.uu3, protocol.dynamic_len,3000, After_recv);
        
        print('sync', s1, o1, s2, o2)
        delay(1000)
    end
    ```

#### async.recv

- 异步接收，用法：`async.recv(connector, nil|protocol, timeout, fn_callback)`
- 比同步send函数的输入参数多一个回调函数
- 回调函数的输入参数与同步recv的返回值相同
- 举例同async.send

#### async.ioctl

- 执行异步控制指令
- 输入参数为设备接口、控制指令名称、table类型的指令参数、回调函数
- 回调函数的输入参数为指令执行结果
- 举例：
    ```lua
    -- 手动建立到服务器的连接
    ioctl(device.tcp_pc1.client1, 'connect', { to = 'tcp_server1.srv1' },
        function(result)
            print('result =', result)
        end
    )
    ```

#### async.on_recv

- 订阅数据到达事件，用法：`async.on_recv(connector, nil|protocol, fn_callback)`
- 举例同async.off_recv

#### async.off_recv

- 取消数据到达事件的订阅，用法：`async.off_recv(connector)`
- 举例
    ```lua
    --发送的回调函数
    function After_send(len)
        print("send len", len)
    end
    --接收的回调函数
    function After_recv(msg, opt)
        print("recved", msg, opt)
    end
    --发送、接收、订阅事件接收、取消订阅事件接收函数
    function Test_recved_event()
        --构造消息报文    
        local msg = message(protocol.dynamic_len)
        msg.seg1 = 4
        msg.seg2 = {1,2,3, 4}
        --同步发送
        local l1 = send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
        local l2 = send(device.dev2.uu2,  'dbca1234\0', {to='dev2.uu3'})
        --延时100ms
        delay(100)
        print("send", l1, l2)
        --订阅事件接收,执行回调函数
        async.on_recv(device.dev2.uu3, nil, After_recv)
        --延时100ms
        delay(100)
        --订阅事件接收,执行回调函数
        async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv)
        --异步发送，执行回调函数
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        --重新构造要发送的消息报文
        msg.seg1 = 5
        msg.seg2 = {5,4,3,2,1}
        --异步发送，执行回调函数
        async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
        --延时500ms
        delay(500)
        -- 取消订阅事件的接收
        async.off_recv(device.dev2.uu2)
    end
    ```

#### async.on

- `async.on(event, cb)`
- 订阅用户自定义事件`event`
- 当`event`事件触发时，cb函数会被调用

#### async.off
- `async.off(event)`
- 关闭对用户自定义事件`event`对订阅

#### async.emit
- `async.emit(event, udata)`
- 触发`event`事件，并传递可选参数udata

## log库

#### log.info

- 记录普通日志信息
- 输出结果为绿色标识
- 举例
    ```lua
    function Test_log()
        COUNT = COUNT + 1;
        log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    end

    ```

#### log.warn

- 记录警告日志信息
- 输出结果为黄色标识
- 举例
    ```lua
    function Test_log()
        print('')
        log.warn("log.warn test")
    end
    ```

#### log.error

- 记录错误日志信息
- 输出结果为红色标识
- 举例
    ```lua
    function Test_log()
        print('')
        log.error("log.error test")
    end
    ```

#### log.step

- 记录测试步骤开始日志
- 举例
    ```lua
    function Test_log()
        print('')
        log.step("log.step test")
    end
    ```

#### log.action

- 记录测试动作执行日志
- 举例
    ```lua
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
    ```lua
    function Test_log()
        print('')
        log.check("aaa", true);
    end
    ```


## string库

#### string.buff2hex

- 将buffer转为16进制字符串
- 举例 `local str = string.buff2hex(buff)`

#### string.hex2buff

- 将16进制字符串转为buffer
- 举例 `local buff = string.hex2buff('AA E0 0F 19 BE')`

#### string.arr2buff

- 将数组数组转为buffer
- 举例 `local buff = string.arr2buff({0x01, 0xEF, 0xAA, 0xEE})`

#### string.byte(s [, i [, j]])

- 输出字符 s[i]， s[i+1]， ...　，s[j] 的内部数字编码
- 输入参数依次为字符串，要输出的开始索引[i]、结束索引[j]
- 默认i=1，j=i
- 举例`string.byte("ABCD",4)输出68`

#### string.char(...)

- 输出和参数数量相同长度的字符串
- 参数为零或者更多的整数
- 每个字符的内部编码值等于对应的参数值
- 举例`string.char(97,98,99,100)输出abcd`

#### string.dump

- 输出包含有以二进制方式表示的（一个 二进制代码块 ）指定函数的字符串
- 之后可以用 load 调用这个字符串获得 该函数的副本（但是绑定新的上值）
- 参数1为function， 如果参数2可选，如果为真值， 二进制代码块不携带该函数的调试信息 （局部变量名，行号，等等）
- 举例
    ```lua
    function test(n)
    	print("test:",n)
    end
    
    a = string.dump(test, true)
    b = load(a)
    b(6) 
    --输出
    --test:6
    ```

#### string.find (str, substr, [init, [end]])

- 查找参数1(字符串)中匹配到的参数2 
- 如果找到一个匹配，find 会返回参数1中关于它起始及终点位置的索引； 否则，返回 nil 
- 第三个可选数字参数指明从哪里开始搜索； 默认值为 1 ，同时可以是负值
- 第四个可选参数为 true 时， 关闭模式匹配机制， 此时函数仅做直接的 “查找子串”的操作， 而参数2中没有字符被看作魔法字符 
- 注意，如果给定了参数4　，就必须写上参数3
- 举例` string.find("Hello Lua user", "Lua", 1) 输出 7    9`

#### string.format(...)

- 输出不定数量参数的格式化版本， 格式化串为第一个参数（必须是一个字符串）
- 格式化字符串遵循 ISO C 函数 sprintf 的规则，不同点在于选项 *, h, L, l, n, p 不支持， 另外还增加了一个选项 q， q 选项将一个字符串格式化为两个双引号括起，对内部字符做恰当的转义处理的字符串该字符串可以安全的被 Lua 解释器读回来
- 例如，调用string.format('%q', 'a string with "quotes" and \n new line')
会产生字符串："a string with \"quotes\" and \new line"
- 举例` string.format("the value is:%d",4)输出 the value is:4`

#### string.gmatch(s, pattern)

- 输出一个迭代器函数， 每次调用这个函数都会继续以参数2对参数1做匹配，并返回所有捕获到的值 
- 如果参数2中没有指定捕获，则每次捕获整个参数2
- 举例
    ```lua
    for word in string.gmatch("Hello Lua user", "%a+") do
        print(word) 
    end
    --输出 Hello Lua user
    ```

#### string.gsub(mainString,findString,replaceString,num)

- 在字符串中替换
- mainString 为要操作的字符串， findString 为被替换的字符，replaceString 要替换的字符，num 替换次数（可以忽略，则全部替换）
- 举例`string.gsub("aaaa","a","z",3)输出 zzza 3`

#### string.len

- 参数为一个字符串
- 输出其长度
- 空串 "" 的长度为 0 
- 内嵌零也统计在内，因此 "a\000bc\000" 的长度为 5 
- 举例`string.len("abc")输出3`

#### string.lower

- 参数为一个字符串
- 将其中的大写字符都转为小写后输出
- 其它的字符串不会更改，对大写字符的定义取决于当前的区域设置
- 举例`string.lower("ABC")输出abc`

#### string.match(str, pattern, init)

- 在参数1(字符串)中找到第一个能用参数2匹配到的部分
- 如果能找到，输出其中的捕获物； 否则返回 nil 
- 如果参数2中未指定捕获， 输出整个参数2捕获到的串
- 第三个可选数字参数，指明从哪里开始搜索； 它默认为1，可以是负数
- 举例`string.match("I have 2 questions for you.", "%d+ %a+")输出 2 questions`

#### string.packsize

- 输出以指定格式用 string.pack 打包的字符串的长度
- 格式化字符串中不可以有变长选项 's' 或 'z'(见打包和解包用到的格式串)

#### string.rep(s, n [, sep])

- 输出 参数2(正数) 个参数1(参数1) 以参数3(字符串)为分割符连在一起的字符串
- 默认的参数3值为空字符串（即没有分割符）
- 如果参数2不是正数则返回空串
- 举例`string.rep("abcd",2) 输出 abcdabcd`

#### string.reverse

- 输出字符串的翻转串
- 输入参数为字符串
- 举例`string.reverse("Lua") 输出 auL`

#### string.sub(s, i [, j])

- 输出参数1的子串， 该子串从参数2开始到参数3为止； 参数2 和 参数3 都可以为负数。 如果不给出参数3 ，就当它是 -1 （和字符串长度相同） 
- 调用 string.sub(参数1,1,参数3) 可以返回参数1的长度为参数3 的前缀串， 而 string.sub(参数1, -参数2) 返回长度为参数2的后缀串。
- 如果在对负数索引转义后参数2小于 1 的话，就修正回 1  
- 如果参数3比字符串的长度还大，就修正为字符串长度 
- 如果在修正之后，参数2大于参数3， 函数返回空串。
- 举例
    ```lua
    -- 字符串
    local sourcestr = "prefix--runoobgoogletaobao--suffix"
    print("\n原始字符串", string.format("%q", sourcestr))
    
    -- 截取部分，第1个到第15个
    local first_sub = string.sub(sourcestr, 4, 15)
    print("\n第一次截取", string.format("%q", first_sub))
    
    -- 取字符串前缀，第1个到第8个
    local second_sub = string.sub(sourcestr, 1, 8)
    print("\n第二次截取", string.format("%q", second_sub))
    
    -- 截取最后10个
    local third_sub = string.sub(sourcestr, -10)
    print("\n第三次截取", string.format("%q", third_sub))
    
    -- 索引越界，输出原始字符串
    local fourth_sub = string.sub(sourcestr, -100)
    print("\n第四次截取", string.format("%q", fourth_sub))
    
    --执行输出

    --原始字符串    "prefix--runoobgoogletaobao--suffix"

    --第一次截取    "fix--runoobg"
    
    --第二次截取    "prefix--"
    
    --第三次截取    "ao--suffix"
    
    --第四次截取    "prefix--runoobgoogletaobao--suffix"
    ```

#### string.unpack

#### string.pack 

- `大端字节序(网络字节序) 和 小端字节序（主机字节序）`先了解一下 大端编码和小端编码，大端就是将高位字节放到内存的低地址端，低位字节放到高地址端。网络传输中(比如TCP/IP)低地址端(高位字节)放在流的开始，对于2个字节的字符串(ab)，传输顺序为：a(0-7bit)、b(8-15bit)。
之所以又称为 网络字节序，是因为网络传输时，默认是大端编码传输的。
如果把计算机的内存看做是一个很大的字节数组，一个字节包含 8 bit 信息可以表示 0-255 的无符号整型，以及 -128—127 的有符号整型。当存储一个大于 8 bit 的值到内存时，这个值常常会被切分成多个 8 bit 的 segment 存储在一个连续的内存空间，一个 segment 一个字节。有些处理器会把高位存储在内存这个字节数组的头部，把低位存储在尾部，这种处理方式叫 大端字节序 ，有些处理器则相反，低位存储在头部，高位存储在尾部，称之为 小端字节序 

- string.pack 负责将不同的变量打包在一起，成为一个字节字符串
- string.unpack 负责将字节字符串解包成为变量
- 举例 
    ```lua
    local unpack = string.unpack
    local pack = string.pack
    local str1 = pack(">b",-128) --最小支持 -128
    local str2 = pack("<b",127) --最大支持 127
    
    --如果把 pack("b",127) 改为 pack("b",128)，就会出现下面的错误
    --bad argument #2 to 'pack' (integer overflow)，意思是pack的第二个参数整型溢出了
    
    print(unpack(">b", str1)) 
   -- 输出 -128  2 ，这个2表示下一个字节的位置
    
    print(unpack("<b", str2)) 
    --输出127  2 ，这个2表示下一个字节的位置
    ```

#### string.upper

- 输入参数为一个字符串 
- 将其中的小写字符都转为大写后输出 
- 其它的字符串不会更改，对小写字符的定义取决于当前的区域设置
- 举例`string.lower("abc")输出ABC`

#### 打包和解包用到的格式串

- 用于 string.pack， string.packsize， string.unpack 的第一个参数
- 是一个描述了需要创建或读取的结构之布局
- 格式串是由转换选项构成的序列。 这些转换选项如下
-  小于号(<) : 设为小端编码
-  大于号(>) : 设为大端编码
- ![n] : 将最大对齐数设为 n （默认遵循本地对齐设置）
- b : 一个有符号字节 (char)
- B : 一个无符号字节 (char)
- h : 一个有符号 short （本地大小）
- H : 一个无符号 short （本地大小）
- l : 一个有符号 long （本地大小）
- L : 一个无符号 long （本地大小）
- j : 一个 lua_Integer
- J : 一个 lua_Unsigned
- T : 一个 size_t （本地大小）
- i[n] : 一个 n 字节长（默认为本地大小）的有符号 int
- I[n] : 一个 n 字节长（默认为本地大小）的无符号 int
- f : 一个 float （本地大小）
- d : 一个 double （本地大小）
- n : 一个 lua_Number
- cn : n字节固定长度的字符串
- z : 零结尾的字符串
- s[n] : 长度加内容的字符串，其长度编码为一个 n 字节（默认是个 size_t） 长的无符号整数。
- x : 一个字节的填充
- Xop : 按选项 op 的方式对齐（忽略它的其它方面）的一个空条目
- ' ' : （空格）忽略
- （ "[n]" 表示一个可选的整数。） 除填充、空格、配置项（选项 "xX <=>!"）外， 每个选项都关联一个参数（对于 string.pack） 或结果（对于 string.unpack）
- 对于选项 "!n", "sn", "in", "In", n 可以是 1 到 16 间的整数
- 所有的整数选项都将做溢出检查
- string.pack 检查提供的值是否能用指定的字长表示
- string.unpack 检查读出的值能否置入 Lua 整数中
- 任何格式串都假设有一个 "!1=" 前缀， 即最大对齐为 1 （无对齐）且采用本地大小端设置。
- 对齐行为按如下规则工作： 对每个选项，格式化时都会填充一些字节直到数据从一个特定偏移处开始， 这个位置是该选项的大小和最大对齐数中较小的那个数的倍数； 这个较小值必须是 2 个整数次方。 选项 "c" 及 "z" 不做对齐处理； 选项 "s" 对对齐遵循其开头的整数
- string.pack 用零去填充 （string.unpack 则忽略它）

## math库

#### math.abs 

- 输出参数的绝对值(integer/float)
- 举例`math.abs(-15)输出15`

#### math.acos 

- 输出参数的反余弦值（用弧度表示）
- 举例`math.acos(0.5)输出1.04719755`

#### math.asin

- 输出参数的反正弦值（用弧度表示）
- 举例`math.asin(0.5)输出0.52359877`
 
#### math.atan

- 输出 参数1/参数2（参数2为可选参数）的反正切值（用弧度表示）。 
- 它会使用两个参数的符号来找到结果落在哪个象限中（即使参数2为零时，也可以正确的处理）
- 默认的参数2是 1 ，因此调用 math.atan(参数1) 将返回参数1的反正切值
- 举例`math.atan(0.5)输出0.463647609`

#### math.ceil

- 输出不小于参数的最大整数值
- 举例`math.ceil(4.8)输出5`

#### math.cos

- 输出参数的余弦（假定参数是弧度）
- 举例`math.cos(0.5)输出0.87758256`

#### math.deg 

- 将角 参数 从弧度转换为角度
- 举例`math.deg(math.pi)输出180`

#### math.exp

- 输出 e的x次方(假定参数为x) 的值（e 为自然对数的底）
- 举例`math.exp(2)输出2.718281828`

#### math.floor 

- 输出不大于参数的最大整数值
- 举例`math.floor(5.6))输出5`

#### math.fmod 

- 返回参数1除以参数2，将商向零圆整后的余数。 (integer/float)
- 举例`math.mod(14, 5)输出4`

#### math.huge

- 浮点数 HUGE_VAL， 这个数比任何数字值都大

#### math.log

- 返回以指定底的 参数1 的对数，默认的参数2是e（因此此函数返回参数1 的自然对数）
- 举例`math.log(2.71)输出0.9969`

#### math.max 

- 返回参数中最大的值， 大小由 Lua 操作 < 决定(integer/float)
- 举例`math.max(2.71, 100, -98, 23)输出100`

#### math.maxinteger

- 最大值的整数

#### math.min 

- 输出参数中最小的值， 大小由 Lua 操作 < 决定(integer/float)
- 举例`math.min(2.71, 100, -98, 23)输出-98`

#### math.mininteger

- 最小值的整数

#### math.modf

- 输出参数的整数部分和小数部分
- 举例`	math.modf(15.98) 输出 15 98`

#### math.pi

- π 的值
- 举例`math.pi输出3.14...`

#### math.rad

- 将角 (参数) 从角度转换为弧度
- 举例`math.rad(180)输出3.14159265358`

#### math.random

- 当不带参数调用时， 返回一个 [0,1) 区间内一致分布的浮点伪随机数。 
- 当以两个整数 m 与 n 调用时， math.random 返回一个 [m, n] 区间 内一致分布的整数为随机数（值 n-m 不能是负数，且必须在 Lua 整数的表示范围内）
- 调用 math.random(n) 等价于 math.random(1,n)
- 这个函数是对 C 提供的位随机数函数的封装。 对其统计属性不作担保
- 举例`math.random(100)等同于math.random(1,100)输出1-100的随机数`

#### math.randomseed 

- 把 参数 设为伪随机数发生器的“种子”： 相同的种子产生相同的随机数列

#### math.sin

- 输出参数的正弦值（假定参数是弧度）
- 举例`math.sin(math.rad(30))输出0.5`

##### math.sqrt

- 输出参数的平方根（你也可以使用乘方 参数^0.5 来计算这个值）
- 举例`math.sqrt(4)输出2`

#### math.tan

- 输出参数的正切值（假定参数是弧度）
- 举例`math.tan(0.5)输出0.5463024`

#### math.tointeger 

- 如果参数可以转换为一个整数， 返回该整数 否则返回 nil
- 举例`math.tointeger("3")输出3,math.tointeger("N")输出nil`

#### math.type 

- 如果参数是整数，返回 "integer" 
- 如果是浮点数，返回 "float"
- 如果不是数字，返回 nil
- 举例`math.type(1)输出integer`

#### math.ult

- 如果整数参数1和 参数2 以无符号整数形式比较， 参数1在 参数2 之下，返回布尔真否则返回假
- 举例`math.ult(-5,8)输出true`

#### math.isequal(f1, f2, is_double)

- 判定两个浮点数是否相等
- 第三个可选参数为布尔型，true：double方式比较， false：float方式比较
- 默认按float方式比较
- 返回true跟false
- 举例`math.isequal(2, 2)输出true`




## table库

#### table.concat (list [, sep [, i [, j]]])

- 提供一个列表，其所有元素都是字符串或数字，返回字符串 list[i]..sep..list[i+1] ··· sep..list[j]。 sep 的默认值是空串， i 的默认值是 1 ， j 的默认值是 #list 。 如果 i 比 j 大，返回空串。
- 举例
    ```lua
    tbl = {"alpha", "beta", "gamma"}
    print(table.concat(tbl, ":"))
    --输出
    --alpha:beta:gamma

    print(table.concat(tbl, nil, 1, 2))
    --输出
    --alphabeta

    print(table.concat(tbl, "\n", 2, 3))
    --输出
    --beta
    --gamma
    ```

#### table.insert (list, [pos,] value)
- 在 list 的位置 pos 处插入元素 value ， 并后移元素 list[pos], list[pos+1], ···, list[#list] 。 pos 的默认值为 #list+1 ， 因此调用 table.insert(t,x) 会将 x 插在列表 t 的末尾。
- 举例
    ```lua
    tbl = {"alpha", "beta", "gamma"}
    table.insert(tbl, "delta")
    print(table.concat(tbl, ", ")
    --输出 alpha, beta, gamma, delta
    ```

#### table.move (a1, f, e, t [,a2])
- 把表a1中从下标f到e的value移动到表a2中，位置为a2下标从t开始
- 表a1，a1下标开始位置f，a1下标结束位置e，t选择移动到的开始位置(如果没有a2，默认a1的下标)
- 举例 
    ```lua
    tbl = {"a","b","c"} 
    newtbl = {1,2,3,5}
    table.move(tbl, 2, 3, 2, newtbl)
    print(table.concat(tbl,","))
    --输出 
    --a,b,c
    
    print(table.concat(newtbl,",")) 
    --输出
    --1,b,c,5
    
    table.move(tbl,2,3,2)
    print(table.concat(tbl,",")) 
    --输出
    --a,b,c
    
    table.move(tbl, 1, #tbl, 2)
    print(table.concat(tbl,",")) 
    --输出
    --a,a,b,c
    ```

#### table.pack (···)
- 以多个元素创建一个新的表
- 任意个数的value
- 举例 
    ```lua
    newtbl = table.pack(1,2,3,5)
    print(table.concat(newtbl,",")) 
    --输出
    --1,2,3,5
    ```

#### table.remove (list [, pos])
- 移除 list 中 pos 位置上的元素，并返回这个被移除的值。 当 pos 是在 1 到 #list 之间的整数时， 它向前移动元素　list[pos+1], list[pos+2], ···, list[#list] 并删除元素 list[#list]； 索引 pos 可以是 #list + 1 ，或在 #list 为 0 时可以是 0 ； 在这些情况下，函数删除元素 list[pos]。

- pos 默认为 #list， 因此调用 table.remove(l) 将移除表 l 的最后一个元素。
- 举例
    ```lua
    local number = {"189","9163", "1512","18991631512"}
    local result = table.remove(number, 1)
    print(result)
    print(number[1])

    --输出
    --189
    --9163
    ```

#### table.sort (list [, comp])
- 在表内从 list[1] 到 list[#list] 原地 对其间元素按指定次序排序。 如果提供了 comp ， 它必须是一个可以接收两个列表内元素为参数的函数。 当第一个元素需要排在第二个元素之前时，返回真 （因此 not comp(list[i+1],list[i]) 在排序结束后将为真）。 如果没有提供 comp， 将使用标准 ETlua 操作 < 作为替代品。

- 排序算法并不稳定； 即当两个元素次序相等时，它们在排序后的相对位置可能会改变。
- 举例
    ```lua
    tbl = {"alpha", "beta", "gamma", "delta"}
    table.sort(tbl)
    print(table.concat(tbl, ", "))
    --输出
    --alpha, beta, delta, gamma
    ```

#### table.unpack (list [, i [, j]])

- 返回list表从i到j位置的value
- 表a1，下标开始位置i，下标结束位置j，i,j如果默认，分别代表1 #list
- 举例 
    ```lua
    newtbl = {1,2,3,5}
    print(table.unpack(newtbl)) 
    --输出1 2 3 5
    
    print(table.unpack(newtbl,2))
    --输出 2 3 5

    print(table.unpack(newtbl,2,3))
    --输出2 3
    ```

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


