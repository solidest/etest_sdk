
function Test_pack_unpack()

    local data_send = {seg_1 = -111, seg_2 = 89}
    local buf = pack(protocol.prot_1, data_send)

    local lua_buf = string.pack('i4i2', -111, 89)
    assert(lua_buf == buf)

    local data_recv = unpack(protocol.prot_1, buf)
    assert(data_recv.seg_1 == data_send.seg_1 and data_recv.seg_2 == data_send.seg_2)

    print('data:', data_send)
    print('buf: '..string.hex(buf), '   bit_count: '..(#buf*8))

end

function Test_pack_message()
    local msg1 = message(protocol.prot_1, {seg_1=0xAF})
    local msg2 = message(protocol.prot_1)
    msg2.seg_1 = 175;
    local buf = pack(msg1)
    print(string.hex(buf), 'len =', #buf)
    -- pack({a=1})
end

function Test_message()
    local msg1 = message(protocol.prot_1)
    print(msg1)

    local msg2 = message(protocol.prot_2, {seg1=100.99, seg2="abcd"})
    print(msg2)

    local msg3 = message(protocol.prot_2)
    msg3.seg1 = 100.99
    msg3.seg2 = "abcd"
    print(msg3)
end

function Test_protocol()
    for key, value in pairs(protocol) do      
        print(key, value)
    end 
end

function entry(vars, option)
    -- print("Hello World!", vars, option)
    Test_protocol()
    Test_message()
    Test_pack_message()
    Test_pack_unpack()
    exit()
end
