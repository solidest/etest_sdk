
record = {a=0, b=0, c=0, e={x=10, y=0}}

function before_record()
    if i<8 then
        return true
    end
    return false
end

function entry()
    i = 0;
    function Interv()
        i = i+1
        print('interval', i)
        record.e = {x=i*20+3, y=i*10}
        -- print(record.e)
        record.a = i
    end
    local t = async.interval(100, 300, Interv)
    delay(3000)
    async.clear(t)
    exit()
end