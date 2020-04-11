function Test_oneof1()
    local data1 = {type1=2, type2=1,  x=1.11, y=2.22, z=3.33}
    local buf = pack(protocol.prot23, data1)
    local data2 = unpack(protocol.prot23, buf)
    assert(data2.z==nil)
    assert(math.isequal(data1.x, data2.x))
    assert(math.isequal(data1.y, data2.y))
    print(data2)
    print('ok')
end


function Test_oneof2()
    local data1 = {type1=0, type2=1,  x=1.11, y=2.22, z=3.33}
    local buf = pack(protocol.prot23, data1)
    local data2 = unpack(protocol.prot23, buf)
    assert(data2.y==nil)
    assert(data2.z==nil)
    assert(math.isequal(data1.x, data2.x))

    print('ok')
end


function Test_oneof3()
    local data1 = {type1=2, type2=1}
    local buf = pack(protocol.prot24, data1)
    local data2 = unpack(protocol.prot24, buf)

    assert(math.isequal(data2.p,1.6))
    assert(math.isequal(data2.type1,data1.type1))
    assert(math.isequal(data2.type2,data1.type2))
    assert(math.isequal(data2.x,3))
    assert(math.isequal(data2.x1,2.23))
    assert(math.isequal(data2.p,1.6))
    
    print('ok')
end

function Test_oneof4()
    local data1 = {type1=3, type2=1}
    local buf = pack(protocol.prot25, data1)
    local data2 = unpack(protocol.prot25, buf)
    assert(math.isequal(data2.p,-6))
    assert(math.isequal(data2.type1,data1.type1))
    assert(math.isequal(data2.type2,data1.type2))
    assert(math.isequal(data2.x,2))
    assert(math.isequal(data2.x1,15))
    assert(math.isequal(data2.p1,-15))
    
    print('ok')
end

function Test_oneof5()
    local data1 = {type1=3, type2=1,x11={1,2,3},p2='11'}
    local buf = pack(protocol.prot26, data1)
    local data2 = unpack(protocol.prot26, buf)
    assert(math.isequal(data2.p,-6))
    assert(math.isequal(data2.type1,data1.type1))
    assert(math.isequal(data2.type2,data1.type2))
    assert(math.isequal(data2.x,2))
    assert(math.isequal(data2.x1,15))
    assert(math.isequal(data2.p1,-15))
    assert(data1.p2 == data2.p2)
    print('ok')
end

function entry(vars, option)
    Test_oneof1()
    Test_oneof2()
    Test_oneof3()
    Test_oneof4()
    Test_oneof5()

    exit()
end