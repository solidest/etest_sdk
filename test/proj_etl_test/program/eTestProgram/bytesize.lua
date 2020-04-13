function Test_ByteSize1()
    local msg = {}
    msg.seg_1 = 0
    msg.seg_2 = "$%@#!~"
    msg.seg_3 = 0

    local buf = pack(protocol.prot30,msg)
    local data = unpack(protocol.prot30, buf)
    print(data)
end


function entry(vars, option)
    Test_ByteSize1()

    exit()
end