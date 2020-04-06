
const prots = require('./sdk/protocols');
const fs = require('fs');

try {
    let fds = prots('test/proj_temp/protocol')
    fs.writeFileSync('temp.json', JSON.stringify(fds, null, 4), 'utf8') 
    for(let p of fds) {
        console.log(p.src, p.name)
    }
} catch (error) {
    console.error(error.message)
}


// console.log(JSON.stringify(fds, null, 4));