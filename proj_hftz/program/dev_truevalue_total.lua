


-- -- 第一步检查

-- function Step01()
--     -- 发送执行指令
--     async.send(...)

--     -- 订阅接收事件
--     async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv01)

--     -- 启动超时定时器
--     ResetTimer(1000)
-- end

-- function After_recv01(msg, opt)
--     -- 判断第一步检查是否执行完毕
--     local step_01_finished = false or true

--     -- 如果执行完毕
--     if(step_01_finished) then
--         Step02()
--     end
-- end


-- -- 第二步检查

-- function Step02()
--     -- 发送执行指令
--     async.send(...)

--     -- 订阅接收事件
--     async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv02)

--     -- 启动超时定时器
--     ResetTimer(1000)
-- end

-- function After_recv02(msg, opt)
--     -- 判断第一步检查是否执行完毕
--     local step_02_finished = false or true

--     -- 如果执行完毕
--     if(step_02_finished) then
--         ResetTimer()
--         Step03()
--     end
-- end

-- function entry()
--     Step01()
-- end


-- 重置定时器

function ResetTimer(t)
    if T then
        async.clear(T)
        T = nil
    end
    T = async.timeout(t, Timeout_err)
end


function Timeout_err()
    error('执行超时了')
end


-- 重置
function Test_truevalue1()
    log.step("reset")
    ResetTimer(500)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "主控软件"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "reset"
    print("发送消息：",msg)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    --接受消息    
    async.on_recv(device.main_ctr.conn, protocol.truvalue, recv1)
    
    
end

function recv1(msg,opt)
    if msg["seg_device_name"] == "测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue2()
    end

end
-- 测试步骤一
function Test_truevalue2()
    A ,B,C = nil
    log.step("第一步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "主控软件"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤一"

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
   --接受消息    
   async.on_recv(device.main_ctr.conn, protocol.truvalue, recv2)

   
end  

function recv2(msg,opt)
    if msg["seg_device_name"] == "测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue3()
    end
    
end



-- 测试步骤二
function Test_truevalue3()
    A ,B,C = nil 
    log.step("第二步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤二"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤二"

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    --接受消息    
    async.on_recv(device.main_ctr.conn, protocol.truvalue, recv3)
    
    
end   

function recv3(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue4()
    end
end
-- 测试步骤三
function Test_truevalue4()
    A ,B,C = nil 
    log.step("第三步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777779"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤三"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤三"



    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
 
    async.on_recv(device.main_ctr.conn,protocol.truvalue,recv4)

end 

function recv4(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        
        Test_truevalue5()
    end
    
end
-- 测试步骤四
function Test_truevalue5()
    A ,B,C = nil 
    log.step("第四步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤四"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤四"



    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    async.on_recv(device.main_ctr.conn,protocol.truvalue,recv5)

end

function recv5(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue6()
    end
    
end
-- 测试步骤五
function Test_truevalue6()
    A ,B,C = nil 
    log.step("第五步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤五"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤五"

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    async.on_recv(device.main_ctr.conn,protocol.truvalue,recv6)

end
function recv6(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue7()
    end
end
-- 测试步骤六
function Test_truevalue7()
    A ,B,C = nil 
    log.step("第六步")
    ResetTimer(200)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤六"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤六"


    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    async.on_recv(device.main_ctr.conn,protocol.truvalue,recv7)

    
end

function recv7(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        Test_truevalue8()
    end
    
end

-- 测试步骤7
function Test_truevalue8()
    A ,B,C = nil 
    log.step("第七步")
    ResetTimer(100)
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤七"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤七"

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    async.on_recv(device.main_ctr.conn,protocol.truvalue,recv8)

    
end
function recv8(msg,opt)
    if msg["seg_device_name"] == "我是测试设备a" then
        A = msg
        print("收到消息",A)
        log.check(A["seg_device_name"].." , "..A["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备b" then
        B = msg
        print("收到消息",B)
        log.check(B["seg_device_name"].." , "..B["seg_true"],true)
    elseif msg["seg_device_name"] == "我是测试设备c" then
        C = msg
        print("收到消息",C)
        log.check(C["seg_device_name"].." , "..C["seg_true"],true)
    end
    if (A ~= nil and B ~= nil and C ~= nil) then
        A ,B ,C = nil 
        exit()
    end
    
end
function entry(vars, option)
    
    Test_truevalue1()

end