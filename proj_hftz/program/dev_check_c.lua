
function onrecved(msg,opt)
    print("收到主控软件发来信息:  ",msg)

    if msg["seg_2"] == "start" then
        start_check()
    end
end

function start_check()
    local msg = message(protocol.dev_check)
    msg.seg_1 = "我是设备c"
    msg.seg_2 = "end##"
    msg.seg_3 = {1,1,1,1,1}
    send(device.dev_c.conn,msg)
    print("dev_a发送到主控软件成功   ",msg)
end

function entry(vars, option)
    async.on_recv(device.dev_c.conn, protocol.dev_check, onrecved)
end