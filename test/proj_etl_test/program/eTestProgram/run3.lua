function onrecved(msg,opt)

    print(msg,opt)
    if msg == "ping\0" then 
        send(device.dev_c.conn,"pong dev_c\0") 
        delay(1)
 
    elseif msg =="cacl\0" then
        cacl()
    end

    -- local msg = message(protocol.send_1)
    -- msg.seg1 = 5
    -- msg.seg2 = {0,1,2,3,4}
    -- send(device.etest111.etest1,msg)
    -- delay(1000)



end
function cacl()
    for i = 1, 5000 do
        x = math.sin(i)
        send(device.dev_c.conn,"sin(".. i..") = " ..x.."\0")
        delay(1)
    end

end


function entry(vars, option)



    async.on_recv(device.dev_c.conn, nil, onrecved)

end