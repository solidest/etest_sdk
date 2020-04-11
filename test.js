
const prots = require('./sdk/protocols');
const fs = require('fs');

try {
    let text = fs.readFileSync('test/proj_dev_temp/demo/demo.json', 'utf8')
    console.log(JSON.parse(text).crc)
} catch (error) {
    console.error(error.message)
}


// console.log(JSON.stringify(fds, null, 4));