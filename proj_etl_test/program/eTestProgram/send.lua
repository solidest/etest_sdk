

function Test_send()
    local msg = message(protocol.send_1)
    msg.seg1 = 4
    msg.seg2 = {0,2,3, 4}

    local sta = "qwerrrrewqrfasfasdfdftjhuiangiweas;ddfl;ksafffowqpa'wojtsafsdfsdfsdffasdfasadffatteryfggdjgdfjferrrrewqrfasfasdfdftjhuiangiweas;ddfl;ksafffowqpa'wojtsafsdfsdfsdffasdfasadffatteryfggdjgdfjfhrewyysdfijerrrrewqrfasfasdfdftjhuiangiweas;ddfl;ksafffowqpa'wojtsafsdfsdfsdffasdfasadffatteryfggdjgdfjfhrewyysdfijerrrrewqrfasfasdfdftjhuiangiweas;ddfl;ksafffowqpa'wojtsafsdfsdfsdffasdfasadffatteryfggdjgdfjfhrewyysdfijhrewyysdfijsdljgjgsdklfjoweapruiweerpawesdffsafdsafasoiperwafsdlkff;lskfa;sdkfals;akfoweairpoqwererrrwwwwwwaarsdzffffaaaaaasdffgdsffgdaaffsdfearrerrrtgadtsgdfsdgsdfgdsfsgdgsdfgheaytgwajfksdjfa;ssfjoweiporujsaafjksdjflsafisdoafihwawejopqqruosajfaklsdjfgisahgiosdetjgfsd1112223"
    send(device.dev12.udp_name, msg)
    send(device.dev12.udp_name, "msg")
    send(device.dev12.udp_name, "msg\0")
    send(device.dev12.udp_name, "")
    send(device.dev12.udp_name, sta)
    send(device.dev12.s1, "msg\0",{to_port=8000})
    -- 总线连接中通过设置`to`属性标识目标设备接口
    send(device.dev12.s1,msg,{to='dev11.c1'})

    -- send(device.dev12.s1, msg)
    -- send(device.dev12.s3, msg)
    -- send(device.dev12.s4, msg, {to_port=8000})
    -- send(device.dev12.udp_name, string.buf('AA 55 E2 B3'))
    -- send(device.dev2.uu2, msg)
    print(msg)
    print(#sta)
end


function entry(vars, option)
    Test_send()
    exit()
end