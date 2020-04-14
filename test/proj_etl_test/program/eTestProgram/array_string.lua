function Test_str_array()
    local data1 = {}
    data1.seg_1 = {65535}
    data1.seg_2 = {"122","qwer"}
    data1.seg_3 = 1.2345
    local buf = pack(protocol.prot27,data1)
    local data2 = unpack(protocol.prot27, buf)
    assert(data1.seg_1[1] == data2.seg_1[1])
    assert(math.isequal(data1.seg_3,data2.seg_3))
    assert(data1.seg_2[1] == data2.seg_2[1])
    assert(data1.seg_2[2] == data2.seg_2[2])
    print('ok')
end


function Test_str_array1()
    local data1 = {type1=3, type2=1,p2={"qw","w","r","-1.e","0"}}
    local buf = pack(protocol.prot28, data1)
    local data2 = unpack(protocol.prot28, buf)
    
    assert(math.isequal(data2.p,-6))
    assert(math.isequal(data2.type1,data1.type1))
    assert(math.isequal(data2.type2,data1.type2))
    assert(math.isequal(data2.x,2))
    assert(math.isequal(data2.x1,15))
    assert(math.isequal(data2.p1,-15))
    assert(data1.p2[1] == data2.p2[1])
    assert(data1.p2[2] == data2.p2[2])
    assert(data1.p2[3] == data2.p2[3])
    assert(data1.p2[4] == data2.p2[4])
    assert(data1.p2[5] == data2.p2[5])
    
    print('ok')
end


function Test_str_array2()
    local data1 = {type1=1, type2=1}
    local buf = pack(protocol.prot28, data1)
    local data2 = unpack(protocol.prot28, buf)

    assert(math.isequal(data2.type1,data1.type1))
    assert(math.isequal(data2.type2,data1.type2))
    assert(math.isequal(data2.x11,2))
    assert(math.isequal(data2.x1,15))
    assert(math.isequal(7,data2.test))
 
    print('ok')
end

function Test_str_array3()
    local data1 ={}
    data1.seg_3 = 1.002
    local buf = pack(protocol.prot29, data1)
    local data2 = unpack(protocol.prot29, buf)
    print(data2)

end

function entry(vars, option)
    Test_str_array()
    Test_str_array1()
    Test_str_array2()
    Test_str_array3()
    exit()
end