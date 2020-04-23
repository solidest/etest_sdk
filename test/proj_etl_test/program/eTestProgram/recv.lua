function Test_recv()

    -- local msg = message(protocol.send_1) 
    -- msg.seg1 = 4
    -- msg.seg2 = {0,2,3, 4}
    send(device.dev12.s2, "msf\0",{to="dev12.s2"})
    delay(1000)
    local s1, s2 = recv(device.dev12.s2, nil);
    print(s1,s2)



end


function entry()
    Test_recv()
    exit()
end