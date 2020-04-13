
function Test_pack_unpack()
    print('::'..debug.getinfo(1).name..'::')
    local data_send = {seg_1 = -111, seg_2 = 189}
    local buf = pack(protocol.prot_1, data_send)

    local lua_buf = string.pack('i4i2', -111, 189)
    assert(lua_buf == buf)

    local data_recv = unpack(protocol.prot_1, buf)
    assert(data_recv.seg_1 == data_send.seg_1 and data_recv.seg_2 == data_send.seg_2)

    print('data:', data_send)
    print('buf: '..string.hex(buf), '   bit_count: '..(#buf*8))

end

function Test_pack_message()
    log.info('::'..debug.getinfo(1).name..'::')
    local msg1 = message(protocol.prot_1, {seg_1=0xAF} )
    local msg2 = message(protocol.prot_1)
    msg2.seg_1 = 175;
    msg1.seg_2 = 0;
    local buf = pack(msg1)
    print(string.hex(buf), 'len =', #buf)
    -- pack({a=1})
end

function Test_message()
    log.info('::'..debug.getinfo(1).name..'::')
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
    log.info('::'..debug.getinfo(1).name..'::')
    for key, value in pairs(protocol) do      
        print(key, value)
    end 
end

function Test_segment_array()
    log.info('::'..debug.getinfo(1).name..'::')
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
    log.info('::'..debug.getinfo(1).name..'::')
    local data1 = {}
    data1.str1 = "abcd"
    data1.str2 = "FSDDSFiou*789320!@#33%"
    data1.str3 = "的房间看了都放假了ffd"
    data1.seg_5 = string.buf('AA 76 FB CC')
    data1.len = #data1.str2
    print(data1)

    local data2 = unpack(protocol.prot_str, pack(protocol.prot_str, data1))
    assert(data1.str1 == data2.str1)
    assert(data1.str2 == data2.str2)
    print(string.hex(data2.seg_5))
end

function Test_segments_mathequal()
    log.info('::'..debug.getinfo(1).name..'::')
    local p = { x = 888.32324, y= -234.3893}
    local data1 = { token = 0x55aa, point = p}
    local data2 = unpack(protocol.prot_point, pack(protocol.prot_point, data1));
    assert(math.isequal(data2.point.x, data1.point.x))
    assert(math.isequal(data2.point.y, data1.point.y))
    print('Test_segments_mathequal ok')
end

function Test_oneof_exp()
    log.info('::'..debug.getinfo(1).name..'::')
    local data1 = {type1=2, type2=1,  x=1.11, y=2.22, z=3.33}
    local buf = pack(protocol.prot_oneof, data1)
    local data2 = unpack(protocol.prot_oneof, buf)
    assert(data2.z==nil)
    assert(math.isequal(data1.x, data2.x))
    print(data2)
    print('Test_oneof_exp ok')
end

-- 验证uint随机值
function Unit_S_pro()
    log.info('::'..debug.getinfo(1).name..'::')
    -- for key, value in pairs(protocol) do      
    --     print(key, value)
    -- end 
    local data_send = {seg_15=32767,seg_17=131071,seg_14=16383,seg_18=26143}
    local buf = pack(protocol.prot_12, data_send)
    local data_recv = unpack(protocol.prot_12, buf)
    print(data_recv.seg_15, data_send.seg_15)
    assert(
        data_recv.seg_14 == data_send.seg_14 
    and data_recv.seg_15 == data_send.seg_15 
    and data_recv.seg_17 == data_send.seg_17 
    and data_recv.seg_18 == data_send.seg_18
    ) 
    exit()
end

function Test_debug()
    log.info('::'..debug.getinfo(1).name..'::')
    local data1 = {seg_14=-1, seg_2=3}
    local buf = pack(protocol.prot_debug, data1)
    print(string.hex(buf))
    local data2 = unpack(protocol.prot_debug, buf)
    print(data1)
    print(data2)
end

function Test_ByteSize()
    log.info('::'..debug.getinfo(1).name..'::')
    local msg = message(protocol.prot_byte_size)
    msg.seg_str = "abljdfs@#$%"
    msg.seg_ints = {12, 34, 9999}
    local buf = pack(msg)
    local data = unpack(protocol.prot_byte_size, buf)
    print(data)
end

function Test_Order()
    log.info('::'..debug.getinfo(1).name..'::')
    local data1 = {seg_1=1.22}
    local buf = pack(protocol.prot_15, data1)
    local data2 = unpack(protocol.prot_15, buf)
    print(data1, data2)
end

function Code_pro8()
    log.info('::'..debug.getinfo(1).name..'::')

    local data_send = {seg_9=-1.234,seg_10=-1.2,seg_11=-22345,seg_12=4294967293,seg_16=4294967293}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    assert(math.isequal(data_recv.seg_9, data_send.seg_9))
    assert(math.isequal(data_recv.seg_10, data_send.seg_10))
    assert(math.isequal(data_recv.seg_11, data_send.seg_11,true))
    print(data_recv)
    assert(math.isequal(data_recv.seg_12, data_send.seg_12))
    assert(math.isequal(data_recv.seg_16, data_send.seg_16))

end

function Test_dynamic_len()
    log.info('::'..debug.getinfo(1).name..'::')
    local msg = message(protocol.dynamic_len)
    msg.seg1 = 4
    msg.seg2 = {1,2,3, 4}
    local msg2 = unpack(protocol.dynamic_len, pack(msg))
    print(msg2)
end

function Test_log()
    log.info('::'..debug.getinfo(1).name..'::')
    print('')
    log.action("log.action test")
    print('')
    log.step("log.step test")
    print('')
    log.info("log.info test")
    print('')
    log.warn("log.warn test")
    print('')
    log.error("log.error test")
    print('')
end

function Test_CheckCode()
    local data1 = {seg_3=-199, seg_5=-998.7777, seg_8=12345}
    local buf = pack(protocol.prot_check, data1)
    local data2 = unpack(protocol.prot_check, buf)
    print(data2)
end

function Test_string_arr()
    local data1 = {iarr={1,2,3}, sarr={"abc", "def", "eee"}}
    local buf = pack(protocol.text_arr, data1)
    local data2 = unpack(protocol.text_arr, buf)
    print(data2)
end

function Test_Xtra()
    local data1 = { seg1=12.89323 }
    local buf = pack(protocol.prot_xtra, data1)
    local data2 = unpack(protocol.prot_xtra, buf)
    print(data2)
end

function entry(vars, option)
    -- print("Hello World!", vars, option)
    -- Test_debug()
    -- Unit_S_pro()
    -- Test_protocol()
    -- Test_message()
    -- Test_pack_message()
    -- Test_pack_unpack()
    -- Test_segment_array()
    -- Test_log()
    -- Test_string()
    -- Test_segments_mathequal()
    -- Test_oneof_exp()
    -- Test_ByteSize()
    -- Test_Order()
    -- Code_pro8()
    -- Test_dynamic_len()
    -- Test_CheckCode()
    -- Test_string_arr()
    Test_Xtra()
    exit()
end
