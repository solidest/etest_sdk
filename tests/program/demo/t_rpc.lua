
local helper = require 'helper'

local test = {

    rpc_cmd = function ()
        local conn = rpc.connect('127.0.0.1', 1211)
        print('conn', conn)
        rpc.command(conn, 'Fn1', {x=10, y=20})
    end,
}


function entry(vars)

    local filter = "r"

    for k, t in pairs(test) do
        if string.sub(k, 1, 1) == filter then
            print('【' .. k .. '】测试开始...')
            local t1 = now()
            local ok, res = pcall(t, vars)
            local t2 = now()
            if ok then
                log.info('【' .. k .. '】测试通过(' .. (t2-t1) .. 'ms)')
            else
                record.test_case = k
                record.test_result = res
                log.error('【' .. k .. '】测试失败, ' .. helper.trim_error_info(res))
            end
        end
    end

    exit()
end
