COUNT = 0
function Test_pack_unpack()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local msg1 = message(protocol.prot_1, {seg_1=0xAF} )
    local msg2 = message(protocol.prot_1)
    msg2.seg_1 = 175;
    msg1.seg_2 = 0;
    local buf = pack(msg1)
    print(string.hex(buf), 'len =', #buf)
    -- pack({a=1})
end

function Test_message()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    for key, value in pairs(protocol) do      
        print(key, value)
    end 
end

function Test_segment_array()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local p = { x = 888.32324, y= -234.3893}
    local data1 = { token = 0x55aa, point = p}
    local data2 = unpack(protocol.prot_point, pack(protocol.prot_point, data1));
    assert(math.isequal(data2.point.x, data1.point.x))
    assert(math.isequal(data2.point.y, data1.point.y))
    print('Test_segments_mathequal ok')
end

function Test_oneof_exp()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
end

function Test_debug()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local data1 = {seg_14=-1, seg_2=3}
    local buf = pack(protocol.prot_debug, data1)
    print(string.hex(buf))
    local data2 = unpack(protocol.prot_debug, buf)
    print(data1)
    print(data2)
end

function Test_ByteSize()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local msg = message(protocol.prot_byte_size)
    msg.seg_str = "abljdfs@#$%"
    msg.seg_ints = {12, 34, 9999}
    local buf = pack(msg)
    local data = unpack(protocol.prot_byte_size, buf)
    print(data)
end

function Test_Order()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local data1 = {seg_1=1.22}
    local buf = pack(protocol.prot_15, data1)
    local data2 = unpack(protocol.prot_15, buf)
    print(data1, data2)
end

function Code_pro8()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

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
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    local msg = message(protocol.dynamic_len)
    msg.seg1 = 4
    msg.seg2 = {1,2,3, 4}
    local msg2 = unpack(protocol.dynamic_len, pack(msg))
    print(msg2)
end

function Test_log()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
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
    log.check("aaa", true);
end

function Test_CheckCode()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    local data1 = {seg_3=-199, seg_5=-998.7777, seg_8=12345}
    local buf = pack(protocol.prot_check, data1)
    local data2 = unpack(protocol.prot_check, buf)
    print(data2)
end

function Test_string_arr()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')
    
    local data1 = {}
    local buf = pack(protocol.text_arr, data1)
    local data2 = unpack(protocol.text_arr, buf)
    print(data2)
end

function Test_Xtra()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    local data1 = { seg1=12.89323 }
    local buf = pack(protocol.prot_xtra, data1)
    local data2 = unpack(protocol.prot_xtra, buf)
    print(data2)
end

function Test_now_delay()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    local t1 = now();
    print('delay 1s')
    delay(1000)
    local t2 = now()
    print(t2-t1)
end

function After_send(len)
    print("send len", len)
end

function After_recv(msg, opt)
    print("recved", msg, opt)
end

function Test_send_recv_async()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    local msg = message(protocol.dynamic_len)
    msg.seg1 = 4
    msg.seg2 = {1,2,3, 4}


    async.send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'}, After_send)
    async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
    send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
    send(device.dev2.uu2,  msg, {to='dev2.uu3'})
    async.send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'}, After_send)
    async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)

    async.recv(device.dev2.uu3, nil, 300, After_recv);
    async.recv(device.dev2.uu3, protocol.dynamic_len, 200, After_recv);
    local s1, o1 = recv(device.dev2.uu3, nil, 200);
    local s2, o2 = recv(device.dev2.uu3, protocol.dynamic_len, 100);
    async.recv(device.dev2.uu3, nil, 300, After_recv);
    async.recv(device.dev2.uu3, protocol.dynamic_len,3000, After_recv);
    
    print('sync', s1, o1, s2, o2)
    delay(1000)
end

function Tout(a1, a2)
    print('timeout', a1, a2)
end

function Interv(a1, a2)
    print('interval', a1, a2)
end

function Test_timer()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    async.timeout(200, Tout, -199, "aaa")
    local t2 = async.interval(100, 300, Interv, -222, "bbbb")
    local t3 = async.timeout(5000, Tout, 100, "不应该能看到我")
    delay(3000)
    async.clear(t2)
    async.clear(t3)
end


function Test_recved_event()
    COUNT = COUNT + 1;
    log.info('  '..COUNT..'  '..'::'..debug.getinfo(1).name..'::')

    local msg = message(protocol.dynamic_len)
    msg.seg1 = 4
    msg.seg2 = {1,2,3, 4}


    local l1 = send(device.dev2.uu2,  'abcd\0', {to='dev2.uu3'})
    local l2 = send(device.dev2.uu2,  'dbca1234\0', {to='dev2.uu3'})
    delay(100)
    print("send", l1, l2)
    async.on_recv(device.dev2.uu3, nil, After_recv)
    delay(100)

    -- 异常测试
    -- async.recv(device.dev2.uu3, nil, 1000, After_recv)

    async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv)

    async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
    msg.seg1 = 5;
    msg.seg2 = {5,4,3,2,1}
    async.send(device.dev2.uu2,  msg, {to='dev2.uu3'}, After_send)
    delay(500)

    async.off_recv(device.dev2.uu2)
end



function entry(vars, option)
    Test_debug()
    Unit_S_pro()
    Test_protocol()
    Test_message()
    Test_pack_message()
    Test_pack_unpack()
    Test_segment_array()
    Test_now_delay()
    Test_log()
    Test_string()
    Test_segments_mathequal()
    Test_oneof_exp()
    Test_ByteSize()
    Test_Order()
    Code_pro8()
    Test_dynamic_len()
    Test_CheckCode()
    Test_string_arr()
    Test_Xtra()
    Test_send_recv_async()
    Test_recved_event()
    Test_timer()
    print("Hello ETL!", vars, option)
    exit()
end
