
--print
function Test_print(v1, v2)
    print("Hello World1")
    print('v1:', v1, 'v2:', v2)
    print(':: test print ::', 'ok\n')
end

--verify assert
function Test_assert_verify(a)
    verify(a>0, '???')
    assert(a>0)
    verify(a==0, '测试验证失败，继续执行')
    print(':: test assert && verify ::', 'ok\n')
    assert(a==0, '测试断言失败，退出执行')
    print('不应该被输出????')
end

--string.hex string.bin
function Test_hex_buf()
    local str1 = 'FAE298E6ACDF3D';
    local strbuf = string.buf(str1)
    verify(string.len(str1)/2==string.len(strbuf))

    local str2 = string.hex(strbuf)
    verify(str1 == str2)
    print(':: test string.hex && string.buf ::', 'ok\n')
end

--delay
function Test_delay_now()
    local t1 = now()
    print('delay 2s ...')
    delay(2000)
    local t2 = now()
    local diff = t2-t1
    verify(diff>=2000)
    
    print('delay 3s ...')
    delay(3000)
    local t3 = now()
    diff = t3-t2;
    verify(diff>=3000)

    local tms = now('ms');
    local tus = now('us');
    local tns = now('ns');
    verify(tns/tus>=1000);
    verify(tus/tms>=1000);

    print(':: test delay && now ::', 'ok\n')
end

--入口函数
function entry(vars, option)
    Test_print(vars, option)
    Test_hex_buf()
    Test_delay_now()
    Test_assert_verify(1)
    exit()
end


