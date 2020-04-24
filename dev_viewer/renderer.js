
const {remote} = require('electron');

function exit() {
    remote.app.quit();
}

module.exports = {
    exit
}