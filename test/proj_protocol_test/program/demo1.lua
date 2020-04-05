

function entry(vars, option)
    print("Hello World1")
    print('vars:', vars, 'option:', option)
    local a = 0
    a = a+1
    verify(a>0, '看不见！')
    assert(a>0, '看不见！')
    verify(a==0, '验证失败，继续执行')
    assert(a==0, '断言失败，退出执行')
    -- print("aaa")
    -- assert(a==0, "断言失败")
    exit()
end
