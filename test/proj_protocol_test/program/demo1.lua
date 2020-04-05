
function Test_assert_verify(a)
    --verify assert
    verify(a>0, '???')
    assert(a>0, '???')
    verify(a==0, '验证失败，继续执行')
    assert(a==0, '断言失败，退出执行')
end

function Test_print(v1, v2)
    --print
    print("Hello World1")
    print('v1:', v1, 'v2:', v2)
end

function Test_hex_buf()
    --string.hex string.bin
    local str = 'FAE298E6ACDF3D';
    local strbuf1 = string.buf(str)
    print('strbuf.len:', string.len(strbuf1))
    local strbuf2 = string.hex(strbuf1)
    print('strhex: ', strbuf2)
    assert(str == strbuf2)
    exit()
end

function entry(vars, option)
    local i1 = 1;
    Test_print(vars, option)
    Test_hex_buf()
    Test_assert_verify(i1)
    
end


