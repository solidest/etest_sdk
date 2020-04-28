-- 重置
function Test_truevalue1()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "主控软件"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "reset"

    print("发送消息：",msg)
    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
   
    
    

end

-- 测试步骤一
function Test_truevalue2()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "主控软件"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤一"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
   
    
end   

-- 测试步骤二
function Test_truevalue3()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤二"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤二"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    
    
end   

-- 测试步骤三
function Test_truevalue4()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777779"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤三"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤三"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
 
    
end 

-- 测试步骤四
function Test_truevalue5()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤四"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤四"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    
end

-- 测试步骤五
function Test_truevalue6()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤五"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤五"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    
end

-- 测试步骤六
function Test_truevalue7()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤六"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤六"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    
end


-- 测试步骤7
function Test_truevalue8()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777710"
    msg.seg_device_name = "我是主控软件"
    msg.seg_start = "start测试步骤七"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","1","1","1","1","2","2","0"}
    msg.seg_true = "测试步骤七"

    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
        log.check(data["seg_true"],true)
    end
    async.recv(device.main_ctr.conn,protocol.truvalue,500,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})

    
end
function entry(vars, option)
    log.step("第一步")
    Test_truevalue1()
    delay(500)
    log.step("第二步")
    Test_truevalue2()
    delay(500)
    -- log.step("第三步")
    -- Test_truevalue1()
    -- delay(500)
    -- Test_truevalue3()
    -- delay(500)
    -- log.step("第四步")
    -- Test_truevalue1()
    -- delay(500)
    -- Test_truevalue4()
    -- delay(500)
    -- log.step("第五步")
    -- Test_truevalue1()
    -- delay(1000)
    -- Test_truevalue5()
    -- delay(500)
    -- log.step("第六步")
    -- Test_truevalue1()
    -- delay(500)
    -- Test_truevalue6()
    -- delay(500)
    -- log.step("第七步")
    -- Test_truevalue1()
    -- delay(500)
    -- Test_truevalue7()
    -- delay(500)
    -- log.step("第八步")
    -- Test_truevalue1()
    -- delay(500)
    -- Test_truevalue8()
    -- delay(500)
    exit()

end