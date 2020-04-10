function Test_string()
    local data1 = {}
    data1.seg_1 = 4
    data1.seg_2= "FSDD"
    data1.seg_3= "的房dfr了ffd"
    data1.seg_4 = "qwe"
    data1.seg_5 = '111'
    local da = pack(protocol.prot16, data1)

    local data2 = unpack(protocol.prot16, da)
    assert(data1.seg_1 == data2.seg_1)
    assert(data1.seg_2 == data2.seg_2)
    assert(data1.seg_3 == data2.seg_3)
    assert(data1.seg_4 == data2.seg_4)
    assert(data1.seg_5 == data2.seg_5)

end

function Test_string1()
    local data1 = {}
    data1.seg_1 = 4
    data1.seg_2= "0.00"
    data1.seg_3= "的房dd"
    data1.seg_4 = "qwe"
    data1.seg_5 = '111'
    local da = pack(protocol.prot16, data1)

    local data2 = unpack(protocol.prot16, da)
    assert(data1.seg_1 == data2.seg_1)
    assert(data1.seg_2 == data2.seg_2)
    assert(data1.seg_3 == data2.seg_3)
    assert(data1.seg_4 == data2.seg_4)
    assert(data1.seg_5 == data2.seg_5)

end


function Test_string2()
    local data1 = {}
    data1.seg_1 = "qwer"
    data1.seg_2= "1212"
    data1.seg_3= "erdd"
    data1.seg_4 = "q.we"

    local da = pack(protocol.prot17, data1)

    local data2 = unpack(protocol.prot17, da)
    assert(data1.seg_1 == data2.seg_1)
    assert(data1.seg_2 == data2.seg_2)
    assert(data1.seg_3 == data2.seg_3)
    assert(data1.seg_4 == data2.seg_4)
    assert(data1.seg_5 == data2.seg_5)

end

function Test_string3()
    local data1 = {seg_1=0xaa}
    data1.seg_1 = string.format("%d", data1.seg_1)
    local da = pack(protocol.prot18, data1)
    print(string.hex(da))
    local data2 = unpack(protocol.prot18, da)
    print(string.hex(data2.seg_1))
    assert(data2.seg_1== data2.seg_1)
 

end

function entry(vars, option)
    Test_string()
    Test_string1()
    Test_string2()
    Test_string3()
    exit()
end