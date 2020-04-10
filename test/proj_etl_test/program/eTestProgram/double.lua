-- 验证double中间值
function Double_T_pro()
    local data_send = {seg_2=0,}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_2== data_send.seg_2)
  

end



-- 验证double最小边界值
function Double_Bmax_pro()
    local data_send = {seg_2=-1.7976E+308}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_2== data_send.seg_2)
  

end

-- 验证double最大边界值
function Double_Bmin_pro()
    local data_send = {seg_2=1.7976E+308}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_2== data_send.seg_2)
  

end

-- 验证double随机值
function Double_S_pro()
    local data_send = {seg_2=1.797667}
    local buf = pack(protocol.prot_13, data_send)
    local data_recv = unpack(protocol.prot_13, buf)
    assert(
        data_recv.seg_2== data_send.seg_2)
  

end


--入口函数
function entry(vars, option)
    Double_T_pro()
    Double_Bmax_pro()
    Double_Bmin_pro()
    Double_S_pro()
    exit()
end