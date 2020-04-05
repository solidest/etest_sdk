
--print
function Test_print(v1, v2)
    print("Hello World1")
    print('v1:', v1, 'v2:', v2)
    print('::test print::', 'ok')
end

--verify assert
function Test_assert_verify(a)
    verify(a>0, '???')
    assert(a>0)
    verify(a==0, '测试验证失败，继续执行')
    print('::test assert verify::', 'ok')
    assert(a==0, '测试断言失败，退出执行')
end

--string.hex string.bin
function Test_hex_buf()
    local str1 = 'FAE298E6ACDF3D';
    local strbuf = string.buf(str1)
    assert(string.len(str1)/2==string.len(strbuf))

    local str2 = string.hex(strbuf)
    assert(str1 == str2)
    print('::test string.hex string.buf::', 'ok')
end

--delay
function Test_delay()
    print('delay 2s')
    delay(2000)
    print('delay 3s')
    delay(3000)
    print('::test delay::', 'ok')
end

--入口函数
function entry(vars, option)
    Test_print(vars, option)
    Test_hex_buf()
    Test_delay()
    Test_assert_verify(1)
    exit()
end


