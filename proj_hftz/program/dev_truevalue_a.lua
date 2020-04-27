function Onrecved(msg,opt)
    print(msg,opt)
    print("收到主控软件发来信息:",msg)

    if msg["seg_true"] == 1024 then
        start_check()
    elseif msg["seg_true"] == 1025 then
        start_check1()
    end
end

function start_check()
    local msg = message(protocol.truvalue)
    msg.seg_init = 0.3
    msg.seg_device_name = 12
    msg.seg_start = 0
    msg.seg_end = 1
    msg.seg_all = {1,2,0,2,1,2,2,0}
    msg.seg_true = 1025
    send(device.dev_a.conn,msg)
    print("dev_a发送到主控软件成功   ",msg)
end

function start_check1()
    local msg = message(protocol.truvalue)
    local msg = message(protocol.truvalue)
    msg.seg_init = 0.3
    msg.seg_device_name = 12
    msg.seg_start = 0
    msg.seg_end = 1
    msg.seg_all = {1,2,0,2,1,2,2,0}
    msg.seg_true = 1026
    send(device.dev_a.conn,msg)
    print("dev_a发送到主控软件成功   ",msg)
end


function entry(vars, option)
    async.on_recv(device.dev_a.conn, protocol.turvalue, Onrecved)
end