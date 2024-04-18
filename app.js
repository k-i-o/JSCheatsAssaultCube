const {app, BrowserWindow, ipcMain, Notification } = require('electron')
try { require('electron-reloader')(module);} catch {};
const path = require('path');
//const { startCheatsLogic } = require('./cheatsMain');
const { OverlayController, OVERLAY_WINDOW_OPTS } = require('electron-overlay-window');
const url = require('url');
const { discordRPC } = require('./discord');
const CheatsMain = require('./cheatsMain');

let mainWindow = null;
let overlayWindow = null;
let cheats = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'src/assets/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js'),
        },
        frame: false,
        titleBarStyle: 'hidden',
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.on("ready-to-show", async () => {
        mainWindow.webContents.openDevTools();

    });

}

const createOverlayWindow = () => {
    overlayWindow = new BrowserWindow({
        ...OVERLAY_WINDOW_OPTS,
        width: 800,
        height: 600,
        resizable: false,
        transparent: true,
        icon: path.join(__dirname, 'src/assets/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'src/preload.js'),
        },
        frame: false,
        titleBarStyle: 'hidden',
    });

    overlayWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'src/overlay.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    overlayWindow.on('closed', () => {
        overlayWindow = null
    });

}

app.whenReady().then(async () => {

    discordRPC(mainWindow, "1229541932431179797");

    ipcMain.on('close', (event) => {
        app.quit();
    });

    ipcMain.on('minimize', (event) => {
        mainWindow.minimize();
    });

    ipcMain.on('esp', (event) => {
        overlayWindow.webContents.send('esp');
    });

    ipcMain.on('infiniteAmmo', (event) => {
        cheats.infiniteAmmo = !cheats.infiniteAmmo;
    });
    
    if (mainWindow === null){
        createWindow();    
        createOverlayWindow();    

        OverlayController.attachByTitle(overlayWindow, 'AssaultCube');
        // OverlayController.on('attach', ev => { console.log('WO: attach', ev) })
        // OverlayController.on('detach', ev => { console.log('WO: detach', ev) })
        // OverlayController.on('blur', ev => { console.log('WO: blur', ev)})
        // OverlayController.on('focus', ev => { console.log('WO: focus', ev)})
        // OverlayController.on('fullscreen', ev => console.log('WO: fullscreen', ev))
        // OverlayController.on('moveresize', ev => console.log('WO: fullscreen', ev))

        if (process.platform === 'win32')
        {
            app.setAppUserModelId("AssaultCubeJSx");
        }    

        cheats = new CheatsMain();        
    }

});

async function getItem(key) {

    let result = await mainWindow.webContents.executeJavaScript('localStorage.getItem("'+key+'");', true);
    
    return JSON.parse(result);
    
}

async function setItem(key, value) {

    let result = await mainWindow.webContents.executeJavaScript('localStorage.setItem("'+key+'", JSON.stringify('+value+'));', true);

    return result;
    
}
