-- 验证uint的8的整数倍数
function Uint_pro()
    local data_send = {seg_8=127,seg_16=65535,seg_24=16777215,seg_32=4294967295,seg_1}
    local buf = pack(protocol.prot_12, data_send)
    local data_recv = unpack(protocol.prot_12, buf)
    print(data_recv)
    assert
        (
            data_recv.seg_8 == data_send.seg_8 
        and data_recv.seg_16 == data_send.seg_16 
        and data_recv.seg_24 == data_send.seg_24  
        and data_recv.seg_32 == data_send.seg_32
        ) 
    -- print('data:', data_send)
    -- print('buf: '..string.hex(buf), '   bit_count: '..(#buf*8))
end

-- 验证unit特殊值
function Unit_T_pro()

    local data_send = {seg_1=0,seg_31=2147483641,seg_2=1,seg_30=1073741824}
    local buf = pack(protocol.prot_12, data_send)
    local data_recv = unpack(protocol.prot_12, buf)

    assert
        (
            data_recv.seg_1 == data_send.seg_1 
        and data_recv.seg_2 == data_send.seg_2 
        and data_recv.seg_30 == data_send.seg_30 
        and data_recv.seg_31 == data_send.seg_31 
        ) 
end

-- 验证uint随机值
function Unit_S_pro()
    local data_send = {seg_15=32768,seg_17=131072,seg_14=16383,seg_18=26144}
    local buf = pack(protocol.prot_12, data_send)
    local data_recv = unpack(protocol.prot_12, buf)
    print(data_recv)
    print(data_send)
    assert(
        data_recv.seg_14 == data_send.seg_14 
    and data_recv.seg_15 == data_send.seg_15 
    and data_recv.seg_17 == data_send.seg_17 
    and data_recv.seg_18 == data_send.seg_18
    ) 
end


--入口函数
function entry(vars, option)


    Uint_pro()
    Unit_T_pro()
    Unit_S_pro()
   
    exit()
end