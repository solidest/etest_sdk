function Test_checkcode()
    local data = {}
    data.seg_1 = "1.3"
    local buf = pack(protocol.prot32,data)
    local data1 = unpack(protocol.prot32,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")

end

function Test_checkcode1()
    local data = {}
    data.seg_1 = 34567
    local buf = pack(protocol.prot33,data)
    local data1 = unpack(protocol.prot33,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")



end


function Test_checkcode2()
    local data = {}
    data.seg_1 = - 34567
    local buf = pack(protocol.prot34,data)
    local data1 = unpack(protocol.prot34,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")



end



function Test_checkcode3()
    local data = {}
    data.seg_1 = {-22,34}
    local buf = pack(protocol.prot36,data)
    local data1 = unpack(protocol.prot36,buf)
    assert(data.seg_1[1] == data1.seg_1[1])
    print("ok")



end


function Test_checkcode4()
    local data = {}
    data.seg_1 = {"@#","rt"}
    local buf = pack(protocol.prot35,data)
    local data1 = unpack(protocol.prot35,buf)
    assert(data.seg_1[1] == data1.seg_1[1])
    print("ok")



end



function Test_checkcode5()
    local data = {}
    data.seg_1 = "1.3"
    local buf = pack(protocol.prot37,data)
    local data1 = unpack(protocol.prot37,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")

end


function Test_checkcode6()
    local data = {}
    data.seg_1 = 34567
    local buf = pack(protocol.prot38,data)
    local data1 = unpack(protocol.prot38,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")



end




function Test_checkcode7()
    local data = {}
    data.seg_1 = - 34567
    local buf = pack(protocol.prot39,data)
    local data1 = unpack(protocol.prot39,buf)
    assert(data.seg_1 == data1.seg_1)
    print("ok")



end



function Test_checkcode8()
    local data = {}
    data.seg_1 = {"qwe","qwe"}
    local buf = pack(protocol.prot40,data)
    local data1 = unpack(protocol.prot40,buf)
    assert(data.seg_1[1] == data1.seg_1[1])
    print("ok")



end

function entry(vars, option)

    Test_checkcode()
    Test_checkcode1()
    Test_checkcode2()
    Test_checkcode3()
    Test_checkcode4()
    Test_checkcode5()
    Test_checkcode6()
    Test_checkcode7()
    Test_checkcode8()
    exit()

end