

function entry(vars, option)
    print("Hello World1")
    print('vars:', vars, 'option:', option)
    local a = 0
    a = a+1
    verify(a>0, '???')
    assert(a>0, '???')
    verify(a==0, '验证失败，继续执行')
    assert(a==0, '断言失败，退出执行')
    exit()
end
