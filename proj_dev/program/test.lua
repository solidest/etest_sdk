
function Test_recv()
    -- local msg = message(protocol.send_1) 
    -- msg.seg1 = 4
    -- msg.seg2 = {0,2,3, 4}
    send(device.dev12.s2, "msf\0",{to="dev12.s1"})
    delay(1000)
    local s1, s2 = recv(device.dev12.s1, nil);
    print(s1,s2)
end

function entry()
    local msg = message(protocol.truvalue)
    msg.seg_init = "7777777"
    msg.seg_device_name = "测试设备a"
    msg.seg_start = "start"
    msg,seg_end = "start-end"
    msg.seg_all = {"1","0","1","1","0","2","2","0"}
    msg.seg_true = "reset完成"
    local buf = pack(msg)
    print('pack len', #buf)
    local msg2 = unpack(protocol.truvalue, buf)
    print('unpack', msg2)
    exit()
    
end