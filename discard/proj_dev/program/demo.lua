
-- 触发超时错误
function Timeout_err()
    error('执行超时了')
end

-- 重置定时器
function ResetTimer(t)
    if T then
        async.clear(T)
        T = nil
    end
    T = async.timeout(t, Timeout_err)
end


-- 第一步检查

function Step01()
    -- 发送执行指令
    -- async.send(...)

    -- 订阅接收事件
    async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv01)

    -- 启动超时定时器
    ResetTimer(100)
end

function After_recv01(msg, opt)
    -- 判断第一步检查是否执行完毕
    local step_01_finished = false or true

    -- 如果执行完毕
    if(step_01_finished) then
        Step02()
    end
end


-- 第二步检查

function Step02()
    -- 发送执行指令
    -- async.send( ... )

    -- 订阅接收事件
    async.on_recv(device.dev2.uu3, protocol.dynamic_len, After_recv02)

    -- 启动超时定时器
    ResetTimer(200)
end

function After_recv02(msg, opt)
    -- 判断第一步检查是否执行完毕
    local step_02_finished = false or true

    -- 如果执行完毕
    if(step_02_finished) then
        -- Step03()
    end
end

function entry()
    Step01()
end