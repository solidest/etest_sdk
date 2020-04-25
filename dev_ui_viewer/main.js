
const {app, BrowserWindow, globalShortcut} = require('electron');

let mainWindow = null;

app.on('ready', () => {
    //mainWindow = new BrowserWindow({ width: 1024, height: 768, frame: false, show: false});
    mainWindow = new BrowserWindow({ width: 1024, height: 780, show: false});
    mainWindow.webContents.loadFile('index.html');
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        globalShortcut.register('CommandOrControl+E', () => {
            mainWindow.webContents.loadFile('index.html');
        });
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
})