-- 验证float中间值
function Float_T_pro()
    local data_send = {seg_1=0,}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_1== data_send.seg_1)
  

end

-- 验证float最小边界值
function Float_Bmin_pro()
    local data_send = {seg_1=-3.3999999521443642e+38,}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_1== data_send.seg_1)
  
end

-- 验证float最大边界值
function Float_Bmax_pro()
    local data_send = {seg_1=3.3999999521443642e+38,}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_1== data_send.seg_1)
  
end

-- 验证float随机值 小数位需要为15位
function Float_S_pro()
    local data_send = {seg_1=3.399519920349121}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    print(data_recv)
    assert(
        data_recv.seg_1== data_send.seg_1)
  
end

--入口函数
function entry(vars, option)
    Float_T_pro()
    Float_Bmin_pro()
    Float_Bmax_pro()
    Float_S_pro()

end