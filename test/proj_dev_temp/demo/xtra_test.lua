

-- 函数体外面可以编写即时执行的测试代码
-- 正式使用之前，请注释之

local result1 = packFloat_D("segx", 98657.55208009)
print('数字"98657.55208009"，使用 packFloat_D ("segx", ) 打包后的结果是字符串：', result1)

result1 = packFloat_D("WD", 98657.55208009)
print('数字"98657.55208009"，使用 packFloat_D ("WD", ) 打包后的结果是字符串：', result1)

local result2 = packFloat_I("sega", 98657.55208009)
print('数字“98657.55208009”，使用 packFloat_I (, ) 打包后的结果是字符串：', result2)

-- 函数体外面可以编写即时执行的测试代码
-- 正式使用之前，请注释之
local result1 = unpackFloat_D("WD", "12D3489", 1, nil)
print('字符串"12D3489"，使用 unpackFloat_D ("WD", ) 解包后的结果为数字: ', result1)

result1 = unpackFloat_D("segxx", "12D3489F", 1, nil)
print('字符串"12D3489F"，使用 unpackFloat_D ("segxx", ) 解包后的结果为数字: ', result1)

local result2 = unpackFloat_I("segb", "12356F", 1, nil)
print('字符串"12356F"，使用 unpackFloat_I ( ) 解包后的结果为数字: ', result2)


-- 函数体外面可以编写即时执行的测试代码
-- 正式使用之前，请注释之
local test_str = "aabbccff"
local result = my_xor8(test_str, 1, #test_str)
print('"', test_str, '" 使用my_xor8 ( ) 得到的校验结果为： ', result)

test_str = "aabbefg"
result = my_xor8(test_str, 1, #test_str)
print('"', test_str, '" 使用my_xor8 ( ) 得到的校验结果为： ', result)