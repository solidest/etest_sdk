
--print
function Test_print(v1, v2)
    print(':: test print ::')
    print("Hello World1")
    print('v1:', v1, 'v2:', v2)
    print(':: ok ::\n')
end

--verify assert
function Test_assert_verify(a)
    print(':: test assert && verify ::')
    verify(a>0, '???')
    assert(a>0)
    verify(a==0, '<测试>验证失败，继续执行')
    print(':: ok ::\n')
    assert(a==0, '<测试>断言失败，退出执行')
    print('不应该被输出????')
end

--string.hex string.bin
function Test_hex_buf()
    print(':: test string.hex && string.buf ::')
    local str1 = 'FA E2 98 E6 AC DF 3D';
    local strbuf = string.buf(str1)
    verify(#strbuf == 7)

    local str2 = string.hex(strbuf)
    verify(str1 == str2)
    print(':: ok ::\n')
end

--delay
function Test_delay_now()
    print(':: test delay && now ::')
    local t1 = now('us')
    print('delay 2s ...')
    delay(2000)
    local t2 = now('us')
    local diff = t2-t1
    verify(diff>=2000000)
    
    print('delay 3s ...')
    delay(3000)
    local t3 = now('us')
    diff = t3-t2;
    verify(diff>=3000000)

    local tms = now();
    local tus = now('us');
    local tns = now('ns');
    verify(tns/tus>=1000);
    verify(tus/tms>=1000);

    print(':: ok ::\n')
end

--入口函数
function entry(vars, option)
    Test_print(vars, option)
    Test_hex_buf()
    Test_delay_now()

    Test_assert_verify(1)
    exit()
end


