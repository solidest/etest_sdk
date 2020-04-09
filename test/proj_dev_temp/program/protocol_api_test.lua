
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
    local msg1 = message(protocol.prot_1, {seg_1=0xAF} )
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

function Test_segment_array()
    local data1 = {}
    data1.seg_1 = {true, false, true, false, 1, 0, true, false}
    data1.seg_2 = {7.88, -9.44, 268888}
    data1.seg_3 = 9999.88889
    local buf = pack(protocol.prot_2, data1)
    print(string.hex(buf))
    local data2 = unpack(protocol.prot_2, buf)
    print(data1, '\n', data2)
end

function Test_string()
    local data1 = {}
    data1.str1 = "abcd"
    data1.str2 = "FSDDSFiou*789320!@#33%"
    data1.str3 = "的房间看了都放假了ffd"
    data1.len = #data1.str2
    print(data1.str2)

    local data2 = unpack(protocol.prot_str, pack(protocol.prot_str, data1))
    assert(data1.str1 == data2.str1)
    assert(data1.str2 == data2.str2)
    print(data2)
end

function Test_segments_mathequal()
    local p = { x = 888.32324, y= -234.3893}
    local data1 = { token = 0x55aa, point = p}
    local data2 = unpack(protocol.prot_point, pack(protocol.prot_point, data1));
    assert(math.isequal(data2.point.x, data1.point.x))
    assert(math.isequal(data2.point.y, data1.point.y))
    print('Test_segments_mathequal ok')
end

function Test_oneof_exp()
    local data1 = {type=2, x=1.11, y=2.22, z=3.33}
    local data2 = unpack(protocol.prot_oneof, pack(protocol.prot_oneof, data1))
    assert(data2.z==nil)
    data1.type = 3
    data2 = unpack(protocol.prot_oneof, pack(protocol.prot_oneof, data1))
    assert(math.isequal(data1.z, data2.z))
    print('Test_oneof_exp ok')
end

function entry(vars, option)
    -- print("Hello World!", vars, option)
    -- Test_protocol()
    -- Test_message()
    -- Test_pack_message()
    -- Test_pack_unpack()
    -- Test_segment_array()
    -- Test_string()
    -- Test_segments_mathequal()
    Test_oneof_exp()
    exit()
end
