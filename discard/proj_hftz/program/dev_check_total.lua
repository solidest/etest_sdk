function Dev_check()
    local msg = message(protocol.dev_check)
    msg.seg_1 = "各个设备开始自检功能"
    msg.seg_2 = "start"
    msg.seg_3 = {0,0,0,0,0}
    print("发出信息：  ",msg)
   
    -- - 接收消息
    function recv_data(data,opt)
        if data == nil then
            error('执行时间超时')
        end
        print("收到信息：  ",data)
    end
    async.recv(device.main_ctr.conn,protocol.dev_check,200,recv_data)

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
    Dev_check()
    exit()

end