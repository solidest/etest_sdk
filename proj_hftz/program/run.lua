-- function Test1()

--     function recv_data(data,opt)
        
--         print(data,opt)

--     end
--     async.on_recv(device.main_ctr.conn,nil,recv_data)
--     print("ping dev_a")
--     async.send(device.main_ctr.conn,"ping\0",{to="dev_a.conn"})
--     print("ping dev_b")
--     async.send(device.main_ctr.conn,"ping\0",{to="dev_b.conn"})
--     print("ping dev_c")
--     async.send(device.main_ctr.conn,"ping\0",{to="dev_c.conn"})

--     print("\n ","send command to dev_a")
--     send(device.main_ctr.conn,"cacl\0",{to="dev_a.conn"})
--     delay(5000)
--     print("\n ","send command to dev_b")
--     send(device.main_ctr.conn,"cacl\0",{to="dev_b.conn"})
--     delay(5500)
--     print("\n","send command to dev_c")
--     send(device.main_ctr.conn,"cacl\0",{to="dev_c.conn"})
--     delay(8000) 

-- end


-- function entry(vars, option)
--     Test1()
--     exit()

-- end
function Test1()
    local msg = message(protocol.prot_simulation)
    msg.seg_1 = 1024
    msg.seg_2 = "ping"
    msg.seg_3 = 0
    msg.seg_4 = 1.79766
    msg.seg_5 = {"w","we","ee"}
    msg.seg_7 = {255,254}
    print("发出信息：  ",msg)
    --异步发送
    function recv_data(data,opt)
        print("收到信息：  ",data)


    end
    async.on_recv(device.main_ctr.conn,protocol.prot_simulation,recv_data)
    -- print("\n ","send command to dev_a")
    -- send(device.main_ctr.conn,msg,{to="dev_a.conn"})

    -- print("\n ","send command to dev_b")
    -- send(device.main_ctr.conn,msg,{to="dev_b.conn"})

    -- print("\n","send command to dev_c")
    -- send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    -- delay(8000) 

    -- 异步
    print("ping dev_a")
    async.send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("ping dev_b")
    async.send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("ping dev_c")
    async.send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    delay(1000)
    function recv_data(data,opt)
        if data == nil then
            error("超时间")
        end
        print("收到信息：  ",data)


    end
    async.on_recv(device.main_ctr.conn,protocol.prot_simulation,recv_data)
    
  
    

end

function entry(vars, option)
    Test1()
    exit()

end