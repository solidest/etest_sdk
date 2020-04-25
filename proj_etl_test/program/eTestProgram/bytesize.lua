function Test_ByteSize1()
    local msg = {}
    msg.seg_1 = 0
    msg.seg_2 = "$%@#!~"
    msg.seg_3 = 0
    local buf = pack(protocol.prot30,msg)
    local data = unpack(protocol.prot30, buf)
    assert(msg.seg_3 == data.seg_1)
    assert(2 == data.seg_4)
    print('ok')
end

function Test_ByteSize2()
    local msg = {}
    msg.seg_1 = 12
    msg.seg_2 = "1234%dgjJLLL"
    msg.seg_3 = 112
    local buf = pack(protocol.prot30,msg)
    local data = unpack(protocol.prot30, buf)
    assert(2 == data.seg_4)
    print('ok')
end


function Test_ByteSize3()
    local msg = {}
    msg.seg_1 = -34
    msg.seg_2 = "FFFF"
    msg.seg_3 = -987
    local buf = pack(protocol.prot30,msg)
    local data = unpack(protocol.prot30, buf)
    assert(2 == data.seg_4)
    print('ok')
end


function Test_ByteSize4()
    local msg = {}
    msg.seg_1 = -34
    msg.seg_2 = 9223372036854775807
    msg.seg_3 = -987
    local buf = pack(protocol.prot31,msg)
    local data = unpack(protocol.prot31, buf)
    print(data)
    assert(4 == data.seg_4)
    assert(4 == data.seg_5)
    assert(4+4 == data.seg_6)
    assert(data.seg_4 + data.seg_5 == data.seg_6)
    print('ok')
end


function entry(vars, option)
    Test_ByteSize1()
    Test_ByteSize2()
    Test_ByteSize3()
    Test_ByteSize4()

    exit()
end