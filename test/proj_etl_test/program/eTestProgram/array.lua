function Test_array()
    local data1 = {}
    data1.seg_1 = {34, 45, 98, 345, 1, 0, 234, 12344}
    data1.seg_2 = {7, -9, 2688}
    data1.seg_3 = 9999.88889
    data1.seg_4 = 2
    local buf = pack(protocol.prot19,data1)
    print(string.hex(buf))
    local data2 = unpack(protocol.prot19, buf)
    
    print(data1, '\n', data2)
    assert(data1.seg_2[1] == data2.seg_2[1])
    assert(data1.seg_2[2] == data2.seg_2[2])
    assert(data1.seg_2[3] == data2.seg_2[3])
    assert(data1.seg_1[1] == data2.seg_1[1])
    assert(data1.seg_1[2] == data2.seg_1[2])
    assert(data1.seg_1[3] == data2.seg_1[3])
    assert(data1.seg_1[4] == data2.seg_1[4])
    assert(data1.seg_1[5] == data2.seg_1[5])
    assert(data1.seg_1[6] == data2.seg_1[6])
    assert(data1.seg_1[7] == data2.seg_1[7])
    assert(data1.seg_1[8] == data2.seg_1[8])

end



function entry(vars, option)
    Test_array()
    exit()
end