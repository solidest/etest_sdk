function onrecved(msg,opt)
    print("收到主控软件发来信息:  ",msg)
    if msg["seg_1"] == 1024 then
        cacl()
    end
    -- print(type(msg))
    -- if msg == "ping\0" then 
    --     send(device.dev_a.conn,"pong dev_a\0") 
    -- elseif msg == "cacl\0" then
    --     cacl()
        
    -- end

end

function cacl()
    local msg = message(protocol.prot_simulation)
    msg.seg_1 = 2048
    msg.seg_2 = "仿真接口a收到主控软件协议段为seg_1,值是1024   回复2048"
    msg.seg_3 = 0
    msg.seg_4 = 0
    msg.seg_5 = {"?w","we","ee"}
    msg.seg_7 = {255,253}


    send(device.dev_a.conn,msg)

    print("dev_a发送到主控软件成功   ",msg)


end


function entry(vars, option)

    async.on_recv(device.dev_a.conn, protocol.prot_simulation, onrecved)

end