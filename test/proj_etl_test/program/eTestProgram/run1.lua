function onrecved(msg,opt)

    print(msg,opt)

    -- local msg = message(protocol.send_1)
    -- msg.seg1 = 5
    -- msg.seg2 = {0,1,2,3,4}
    -- send(device.etest111.etest1,msg)
    -- delay(1000)



end



function entry(vars, option)



    -- async.on_recv(device.dev_a.conn, protocol.send_1, onrecved)
    while true do
        delay(2000)
        local data,opt = recv(device.dev_a.conn, nil)
        print(data,opt)
    end



end