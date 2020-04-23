function Test1()

    local msg = message(protocol.send_1)
    msg.seg1 = 5
    msg.seg2 = {0,1,2,3,4}

    send(device.main_ctr.conn,msg,{to="dev_a.conn"})
    print("aaa")
    send(device.main_ctr.conn,msg,{to="dev_b.conn"})
    print("bbb")
    send(device.main_ctr.conn,msg,{to="dev_c.conn"})
    print("ccc")
    delay(2000)





end




function entry(vars, option)
    Test1()
    exit()

end