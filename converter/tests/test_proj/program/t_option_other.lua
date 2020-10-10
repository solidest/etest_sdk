
local helper = require 'helper'

local test = {

    o_scale_ral = function ()
        local msg1 = message(protocol.prot_real_scale);
        msg1.seg1 = 100;
        msg1.seg2 = {10, 0.1, 100}
        local msg2 = unpack(protocol.prot_real_scale, pack(msg1));
        assert(math.isequal(msg2.seg1, msg1.seg1))
        for i = 1, 3 do
            math.isequal(msg1.seg2[i], msg2.seg2[i])
        end
    end,

    o_scale_integer = function ()
        local msg1 = message(protocol.prot_int_scale);
        msg1.seg1 = 10000;
        msg1.seg2 = {10, 1, 100}
        local msg2 = unpack(protocol.prot_int_scale, pack(msg1)); 
        assert(math.isequal(msg2.seg1, msg1.seg1))
        for i = 1, 3 do
            math.isequal(msg1.seg2[i], msg2.seg2[i])
        end
    end,

    o_primitive = function ()
        local msg = message(protocol.prot_primitive)
        msg.seg1 = -10.99
        msg.seg2 = -1000299.235456
        msg.seg3 = -97
        msg.seg4 = -97
        msg.seg5 = -97
        msg.seg6 = -97
        msg.seg7 = -97
        local buf = pack(msg)
        -- print(string.buff2hex(buf))
        local len = #buf
        assert(string.sub(buf, len-3, len-3) == string.sub(buf, len-1, len-1) and string.sub(buf, len-2, len-2) == string.sub(buf, len, len))
        local msg2 = unpack(protocol.prot_primitive, buf)
        assert(msg2.seg3==-97 and msg2.seg4==-97 and msg2.seg5==-97 and msg2.seg6==-97 and msg2.seg7==-97)
    end
    
}


function entry(vars)
    DEBUG = false
    local filter = "o"

    for k, t in pairs(test) do
        if string.sub(k, 1, 1) == filter then
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
