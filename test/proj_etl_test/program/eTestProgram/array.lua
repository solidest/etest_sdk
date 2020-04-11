function Test_array()
    local data1 = {}
    data1.seg_1 = {34, 45, 98, 345, 1, 0, 234, 12344}
    data1.seg_2 = {7, -9, 2688}
    data1.seg_3 = 9999.88889
    data1.seg_4 = 2
    local buf = pack(protocol.prot19,data1)
    
    local data2 = unpack(protocol.prot19, buf)
    -- print(string.hex(buf))
    -- print(data1, '\n', data2)
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

function Test_array1()
    local data1 = {}
    data1.seg_1 = {34,}
    data1.seg_2 = {1.2, -1.123}
    data1.seg_4 = 2.34
    local buf = pack(protocol.prot20,data1)
    local data2 = unpack(protocol.prot20, buf)

    assert(data1.seg_1[1] == data2.seg_1[1])
    assert(math.isequal(data1.seg_2[1], data2.seg_2[1]))
    assert(math.isequal(data1.seg_2[2], data2.seg_2[2]))
    assert(data1.seg_4 == data2.seg_4)

end


function Test_array2()
    local data1 = {}
    data1.seg_1 = {}
    data1.seg_2 = {1123, -12133,0}
    data1.seg_3 = 123
    data1.seg_4 = {1.222,0,-2.345}
    local buf = pack(protocol.prot21,data1)
    local data2 = unpack(protocol.prot21, buf)

    assert(data1.seg_1[1] == data2.seg_1[1])
    assert(math.isequal(data1.seg_2[1], data2.seg_2[1]),true)
    assert(math.isequal(data1.seg_2[2], data2.seg_2[2]),true)

    assert(math.isequal(data1.seg_4[1], data2.seg_4[1]))
    assert(math.isequal(data1.seg_4[2], data2.seg_4[2]))
    assert(math.isequal(data1.seg_4[3], data2.seg_4[3]))
 

end


function Test_array3()
    local data1 = {}
    data1.seg_1 = {0}
    data1.seg_2 = {1, -1,0}
    data1.seg_3 = 123
    data1.seg_4 = {1.222,0,-2.345}
    data1.seg_5 = {0}
    local buf = pack(protocol.prot22,data1)
    local data2 = unpack(protocol.prot22, buf)

    assert(data1.seg_1[1] == data2.seg_1[1])
    assert(math.isequal(data1.seg_2[1], data2.seg_2[1]))
    assert(math.isequal(data1.seg_2[2], data2.seg_2[2]))

    assert(math.isequal(data1.seg_4[1], data2.seg_4[1]))
    assert(math.isequal(data1.seg_4[2], data2.seg_4[2]))
    assert(math.isequal(data1.seg_4[3], data2.seg_4[3]))
 

end


function entry(vars, option)
    Test_array()
    Test_array1()
    Test_array2()
    Test_array3()
    exit()
end