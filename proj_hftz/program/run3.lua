function onrecved(msg,opt)

    print("收到主控软件发来信息:  ",msg)
    if math.isequal(msg['seg_3'], 0) then 
        cacl()
        -- send(device.dev_c.conn,"pong dev_c\0") 
        -- delay(1)
 
    -- elseif msg =="cacl\0" then
    --     cacl()
    end

end


function cacl()

    -- local a,b = 0,1
    -- for i = 1, 2000 do

        
    --     delay(3)
    --     a = a+0.001
    --     local a1 = a*1000
    --     if a1 < 1000 then
    --         local x = math.sin(a)
    --         send(device.dev_c.conn,"sin("..a..") = " ..x.."\0")
    --     else 
    --         local y = math.sin(b)
    --         send(device.dev_c.conn,"sin("..b..") = " ..y.."\0")
    --         b = b-0.001
        
    --     end
    -- end
    local msg = message(protocol.prot_simulation)
    msg.seg_1 = 2000
    msg.seg_2 = "仿真接口c 收到主控软件协议段为seg_1,值是1024 回复2050"
    msg.seg_3 = 0.09
    msg.seg_4 = 0.009
    msg.seg_5 = {"w23","23we","233ee"}
    msg.seg_7 = {2,53}


    send(device.dev_c.conn,msg)
    print("dev_c发送到主控软件成功:  ",msg)

end


function entry(vars, option)

    async.on_recv(device.dev_c.conn, protocol.prot_simulation, onrecved)

end