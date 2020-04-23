function onrecved(msg,opt)

    print(msg,opt)
    if msg == "ping\0" then 
        send(device.dev_a.conn,"pong dev_a\0") 
    elseif msg == "cacl\0" then
        cacl()
        
    end
    -- local msg = message(protocol.send_1)
    -- msg.seg1 = 5
    -- msg.seg2 = {0,1,2,3,4}
    -- send(device.etest111.etest1,msg)
    -- delay(1000)



end

function cacl()
    for i = 1, 100 do
        send(device.dev_a.conn,""..i.."\0")
        delay(40)
    end

end


function entry(vars, option)



    async.on_recv(device.dev_a.conn, nil, onrecved)
    -- while true do
    --     delay(2000)
    --     local data,opt = recv(device.dev_a.conn, nil)
    --     print(data,opt)
    -- end



end