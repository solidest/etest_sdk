-- 验证补码，反码,大断续，小断续等组合值

function Code_pro()
    local data_send = {seg_1=1.23}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))

  

end

function Code_pro2()
    local data_send = {seg_2=1.23}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
  

end

function Code_pro3()
    local data_send = {seg_3=-111}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  

end

function Code_pro4()
    local data_send = {seg_4=4294967293}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4,true))
  

end

function Code_pro5()
    local data_send = {seg_4=4294967293,seg_1=1.2,seg_2=1.234,seg_3=234}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4,true))
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  
  

end


function Code_pro5()
    local data_send = {seg_4=4294967293,seg_1=1.2,seg_2=1.234,seg_3=234}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_4, data_send.seg_4,true))
    assert(math.isequal(data_recv.seg_1, data_send.seg_1))
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  
  

end

function Code_pro6()
    local data_send = {seg_5=1.234,seg_6=1.2,seg_7=22345,seg_8=23555774}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_5, data_send.seg_5))
    assert(math.isequal(data_recv.seg_6, data_send.seg_6))
    assert(math.isequal(data_recv.seg_7, data_send.seg_7,true))
    assert(math.isequal(data_recv.seg_8, data_send.seg_8,true))
  
  

end

function Code_pro7()

    local data_send = {seg_5=-1.234,seg_6=-1.2,seg_7=-22345,seg_8=23555774}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_5, data_send.seg_5))
    assert(math.isequal(data_recv.seg_6, data_send.seg_6))
    assert(math.isequal(data_recv.seg_7, data_send.seg_7,true))
    assert(math.isequal(data_recv.seg_8, data_send.seg_8,true))
  

end

function Code_pro8()

    local data_send = {seg_9=-1.234,seg_10=-1.2,seg_11=-22345,seg_12=4294967293,seg_16=4294967293}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_9, data_send.seg_9))
    assert(math.isequal(data_recv.seg_10, data_send.seg_10))
    assert(math.isequal(data_recv.seg_11, data_send.seg_11,true))
    assert(math.isequal(data_recv.seg_12, data_send.seg_12))
    assert(math.isequal(data_recv.seg_16, data_send.seg_16))
  

end

function Code_pro9()

    local data_send = {seg_9=1.234,seg_10=1.2,seg_11=22345}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_9, data_send.seg_9))
    assert(math.isequal(data_recv.seg_10, data_send.seg_10))
    assert(math.isequal(data_recv.seg_11, data_send.seg_11,true))

  

end

function Code_pro10()

    local data_send = {seg_13=1.234,seg_14=1.2,seg_15=22345}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_13, data_send.seg_13))
    assert(math.isequal(data_recv.seg_14, data_send.seg_14))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))

  

end

function Code_pro11()

    local data_send = {seg_13=-1.234,seg_14=-1.2,seg_15=-22345}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_13, data_send.seg_13))
    assert(math.isequal(data_recv.seg_14, data_send.seg_14))
    assert(math.isequal(data_recv.seg_15, data_send.seg_15,true))

  

end

function entry(vars, option)

    Code_pro()
    Code_pro2()
    Code_pro3()
    Code_pro4()
    Code_pro5()
    Code_pro6()
    Code_pro7()
    Code_pro8()
    Code_pro9()
    Code_pro10()
    Code_pro11()
    exit()
end