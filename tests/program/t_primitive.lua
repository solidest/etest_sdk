

function entry()
    local msg = message(protocol.prot_primitive)
    msg.seg1 = -10.99
    msg.seg2 = -1000299.235456
    msg.seg3 = -97
    msg.seg4 = -97
    msg.seg5 = -97
    msg.seg6 = -97
    msg.seg7 = -97
    local buf = pack(msg)
    -- print(string.buff2hex(buf))
    assert(string.sub(buf, 13, 13) == string.sub(buf, 16, 16) and string.sub(buf, 16, 16) == string.sub(buf, 22, 22))
    local msg2 = unpack(protocol.prot_primitive, buf)
    assert(msg2.seg3==-97 and msg2.seg4==-97 and msg2.seg5==-97 and msg2.seg6==-97 and msg2.seg7==-97)
    log.info('t_primitive 测试通过')
    exit()
end