
-- 入口函数
function entry(vars, option)
    --在设备dev_a的接口conn上启动监听
    --每当数据到达就去调用Onrecved函数
    async.on_recv(device.dev_a.conn, nil, Onrecved)
end

-- 数据到达事件触发的函数
function Onrecved(msg,opt)
    print(msg,opt)
    if msg == "ping\0" then --如果收到ping指令就回复pong
        send(device.dev_a.conn,"pong dev_a\0") 
    elseif msg == "cacl\0" then --如果收到cacl指令就执行计算
        Cacl()
    end
end

--用作计算的函数
function Cacl()
    --将0到100做为字符串在设备dev_a的接口conn上发送出去
    for i = 1, 100 do
        send(device.dev_a.conn,""..i.."\0")
        delay(40)
    end
end


