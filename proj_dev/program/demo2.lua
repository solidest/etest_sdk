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
    async.on_recv(device.main_ctr.conn,protocol.turvalue,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    delay(200)
    
    

end


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
    async.on_recv(device.main_ctr.conn,protocol.turvalue,recv_data)

    -- 发送消息
    print("发送到 dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("发送到 dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("发送到 dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    delay(200)
    
end   


function entry(vars, option)
    log.step("第一步")
    Test_truevalue1()
    delay(1000)
    log.step("第二步")
    Test_truevalue2()
    delay(1000)
    exit()

end