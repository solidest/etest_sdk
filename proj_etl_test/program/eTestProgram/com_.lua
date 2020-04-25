-- 验证组合值

function Com_pro1()
    local data_send = {seg_1=1.22}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))

  

end

function Com_pro2()
    local data_send = {seg_2=0.23334}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
  

end

function Com_pro3()
    local data_send = {seg_3=-111}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  

end

function Com_pro4()
    local data_send = {seg_4=4294967293}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4))
  

end

function Com_pro5()
    local data_send = {seg_4=4294967293,seg_1=1.2,seg_2=1.234,seg_3=234}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4,true))
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  
  

end


function Com_pro6()
    local data_send = {seg_4=4294967293,seg_1=1.2,seg_2=1.234,seg_3=234}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4,true))
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  
  

end

function Com_pro7()
    local data_send = {seg_5=1.234,seg_6=1.2,seg_7=22345,seg_8=23555774}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_5, data_send.seg_5))
    assert(math.isequal(data_recv.seg_6, data_send.seg_6))
    assert(math.isequal(data_recv.seg_7, data_send.seg_7,true))
    assert(math.isequal(data_recv.seg_8, data_send.seg_8,true))
  
  

end

function Com_pro8()

    local data_send = {seg_9=-1.234,seg_10=-1.2,seg_11=-22345,seg_12=23555774}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_9, data_send.seg_9))
    assert(math.isequal(data_recv.seg_10, data_send.seg_10))
    assert(math.isequal(data_recv.seg_11, data_send.seg_11,true))
    assert(math.isequal(data_recv.seg_12, data_send.seg_12,true))
  

end

function Com_pro9()

    local data_send = {seg_9=1.234,seg_10=1.2,seg_11=22345,seg_12=235557}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_9, data_send.seg_9))
    assert(math.isequal(data_recv.seg_10, data_send.seg_10))
    assert(math.isequal(data_recv.seg_11, data_send.seg_11,true))
    assert(math.isequal(data_recv.seg_12, data_send.seg_12,true))
  
  

end

function Com_pro10()

    local data_send = {seg_13=0.6789,seg_14=2.4567,seg_15=-2233345,seg_16=777685}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_13, data_send.seg_13))
    assert(math.isequal(data_recv.seg_14, data_send.seg_14))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))
    assert(math.isequal(data_recv.seg_16, data_send.seg_16,true))

  

end

function Com_pro11()

    local data_send = {seg_13=-0.6789,seg_14=-2.4567,seg_15=-233345,seg_16=777685}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_13, data_send.seg_13))
    assert(math.isequal(data_recv.seg_14, data_send.seg_14))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))
    assert(math.isequal(data_recv.seg_16, data_send.seg_16,true))

  

end

function Com_pro12()

    local data_send = {seg_17=424,seg_18=43547,seg_19=127,seg_20=126}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_17, data_send.seg_17))
    assert(math.isequal(data_recv.seg_18, data_send.seg_18))
    assert(math.isequal(data_recv.seg_19, data_send.seg_19,true))
    assert(math.isequal(data_recv.seg_20, data_send.seg_20,true))

  

end

function Com_pro13()

    local data_send = {seg_17=-424,seg_18=43547,seg_19=-127,seg_20=126}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    print(data_recv)
    assert(math.isequal(data_recv.seg_17, data_send.seg_17))
    assert(math.isequal(data_recv.seg_18, data_send.seg_18))
    assert(math.isequal(data_recv.seg_19, data_send.seg_19,true))
    assert(math.isequal(data_recv.seg_20, data_send.seg_20,true))

  

end

function Com_pro14()

    local data_send = {seg_13=0,seg_15=0,seg_15=0}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_13, data_send.seg_13))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))

  

end

function Com_pro15()

    local data_send = {seg_17=0,seg_18=0,seg_19=0,seg_20=0}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_17, data_send.seg_17))
    assert(math.isequal(data_recv.seg_18, data_send.seg_18))
    assert(math.isequal(data_recv.seg_19, data_send.seg_19,true))
    assert(math.isequal(data_recv.seg_20, data_send.seg_20,true))

  
  

end

function Com_pro16()

    local data_send = {seg_1=-1.234,seg_17=-0.0,seg_15=-22345}
    local buf = pack(protocol.prot_15, data_send)
    local data_recv = unpack(protocol.prot_15, buf)
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))
    assert(math.isequal(data_recv.seg_17, data_send.seg_17))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))

  

end

function entry(vars, option)

    Com_pro1()
    Com_pro2()
    Com_pro3()
    Com_pro4()
    Com_pro5()
    Com_pro6()
    Com_pro7()
    Com_pro8()
    Com_pro9()
    Com_pro10()
    Com_pro11()
    Com_pro12()
    Com_pro13()
    Com_pro14()
    Com_pro15()
    Com_pro16()
    exit()
end