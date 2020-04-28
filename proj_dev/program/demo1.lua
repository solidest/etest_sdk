function Onrecved(msg,opt)

    print("收到主控软件发来信息:",msg)

    if msg["seg_true"] == "reset" then
        start_check()
    elseif msg["seg_true"] == "测试步骤一" then
        start_check1()
    end
end

function start_check()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "测试设备a"
    msg.seg_start = "start"
    msg,seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "reset完成"
    send(device.dev_a.conn,msg)
    print("dev_a发送到主控软件成功   ",msg)
end

function start_check1()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "测试设备a"
    msg.seg_start = "start"
    msg,seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤一完成"
    send(device.dev_a.conn,msg)
    print("dev_a发送到主控软件成功   ",msg)
end


function entry(vars, option)
    async.on_recv(device.dev_a.conn, protocol.turvalue, Onrecved)
end