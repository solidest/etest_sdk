
function entry()
    delay(10);
    local t1 = now();
    local t2 = now('us');
    local t3 = now('ns');
    print(t1, t2, t3)
    exit()
end