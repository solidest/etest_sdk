function onrecved(msg,opt)

    print(msg,opt)
    if msg == "ping\0" then 
        send(device.dev_c.conn,"pong dev_c\0") 
        delay(1)
 
    elseif msg =="cacl\0" then
        cacl()
    end

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