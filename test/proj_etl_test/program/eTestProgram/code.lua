-- 验证补码，反码等组合值
function Code_pro()
    local data_send = {seg_1=1.23}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    print(buf)
    assert(math.isequal(data_recv.seg_1, data_send.seg_1,true))
  

end

function Code_pro2()
    local data_send = {seg_2=1.23}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    print(buf)
    assert(math.isequal(data_recv.seg_2, data_send.seg_2,true))
  

end

function Code_pro3()
    local data_send = {seg_3=1.23}
    local buf = pack(protocol.prot_14, data_send)
    local data_recv = unpack(protocol.prot_14, buf)
    print(buf)
    assert(math.isequal(data_recv.seg_3, data_send.seg_3,true))
  

end

function entry(vars, option)

    Code_Pro()
    Code_Pro2()
    Code_Pro3()
    exit()
end