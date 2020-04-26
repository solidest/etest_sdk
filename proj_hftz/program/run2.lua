function onrecved(msg,opt)
    print("收到主控软件发来信息:  ",msg)
    if msg["seg_2"] == "ping" then
        cacl()
    end
end

function cacl()

    -- for i = 1, 10 do
    --     x = math.random()*100
    --     y = math.random()*100
    --     x = math.floor(x)
    --     y = math.floor(y)
    --     send(device.dev_b.conn,"x=".. ""..x..  "  y="..y.."\0")
    --     delay(500)
    -- end
    local msg = message(protocol.prot_simulation)
    msg.seg_1 = 2001
    msg.seg_2 = "仿真接口b 收到主控软件协议段为seg_1,值是1024 回复2049"
    msg.seg_3 = 0
    msg.seg_4 = 0
    msg.seg_5 = {"w","we","ee"}
    msg.seg_7 = {255,253}


    send(device.dev_b.conn,msg)

    print("dev_b发送到主控软件成功:  ",msg)

end


function entry(vars, option)

    async.on_recv(device.dev_b.conn, protocol.prot_simulation, onrecved)

end