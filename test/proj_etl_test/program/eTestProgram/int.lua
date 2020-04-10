-- 验证int8的整倍数
function Int_Pro()

    local data_send = {seg_8=127,seg_16=89,seg_24=105,seg_32=-111}
    local buf = pack(protocol.prot_11, data_send)
    local data_recv = unpack(protocol.prot_11, buf)
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

-- 验证int特殊组合

function Eight_pro()

    local data_send = {seg_1=0,seg_31=-6453925591,seg_2=1,seg_30=-16119077055}
    local buf = pack(protocol.prot_11, data_send)
    local data_recv = unpack(protocol.prot_11, buf)

    assert
        (
            data_recv.seg_1 == data_send.seg_1 
        and data_recv.seg_2 == data_send.seg_2 
        and data_recv.seg_30 == data_send.seg_30 
        and data_recv.seg_31 == data_send.seg_31 
        ) 
    -- print('data:', data_send)
    -- print('buf: '..string.hex(buf), '   bit_count: '..(#buf*8))

end

-- 验证int随意位数组合
function Sun_pro()
    local data_send = {seg_15=32768,seg_17=131072,seg_14=-16383,seg_18=26144}
    local buf = pack(protocol.prot_11, data_send)
    local data_recv = unpack(protocol.prot_11, buf)
    print(data_recv)

    assert(
        data_recv.seg_14 == data_send.seg_14 
    and data_recv.seg_15 == data_send.seg_15 
    and data_recv.seg_17 == data_send.seg_17 
    and data_recv.seg_18 == data_send.seg_18
    ) 
    -- -- print('data:', data_send)
    -- print('buf: '..string.hex(buf), '   bit_count: '..(#buf*8))
end


function entry(vars, option)

    Int_Pro()
    Eight_pro()
    Sun_pro()
 
    exit()
end