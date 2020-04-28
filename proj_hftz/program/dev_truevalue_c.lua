function onrecved(msg,opt)

    print("收到主控软件发来信息:",msg)

    if msg["seg_true"] == "reset" then
        start_check()
    elseif msg["seg_true"] == "测试步骤一" then
        start_check1()
    elseif msg["seg_true"] == "测试步骤二" then
        start_check2()
    elseif msg["seg_true"] == "测试步骤三" then
        start_check3()
    elseif msg["seg_true"] == "测试步骤四" then
        start_check4()
    elseif msg["seg_true"] == "测试步骤五" then
        start_check5()
    elseif msg["seg_true"] == "测试步骤六" then
        start_check6()
    elseif msg["seg_true"] == "测试步骤七" then
        start_check7()
    end
end

function start_check()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "测试设备c"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "reset完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check1()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "测试设备c"
    msg.seg_start = "start"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤一完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check2()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤二"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤二完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check3()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤三"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤三完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check4()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤四"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤四完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check5()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤五"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤五完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check6()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤六"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤六完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function start_check7()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777778"
    msg.seg_device_name = "我是测试设备c"
    msg.seg_start = "start测试步骤七"
    msg.seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "测试步骤七完成"
    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功   ",msg)
end

function entry(vars, option)
    async.on_recv(device.dev_c.conn, protocol.truvalue, onrecved)
end