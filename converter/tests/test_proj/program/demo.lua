

function entry()
    
    local msg = message(protocol.prot_option)
    local msg2 = unpack(protocol.prot_option, pack(msg))
    print(msg2)
    exit()
end