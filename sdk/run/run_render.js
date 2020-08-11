
const {
    ipcRenderer
} = window.require('electron');

async function run_script(info) {
    return await ipcRenderer.invoke('run-case', info);
}

async function run_test(info) {
    return await ipcRenderer.invoke('run-test', info);
}

async function stop_run() {
    return await ipcRenderer.invoke('run-stop');
}

async function get_outs(info) {
    return await ipcRenderer.invoke('get-outs', info);
}

function run_cmd(cmd, commander) {
   ipcRenderer.send('run-cmd', cmd, commander);
}



export default {
    run_script,
    run_test,
    run_cmd,
    stop_run,
    get_outs
}