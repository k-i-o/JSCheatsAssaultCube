const {app, BrowserWindow, ipcMain, Notification } = require('electron')
try { require('electron-reloader')(module);} catch {};
const DiscordRPC = require('discord-rpc');
const { startCheatsLogin } = require('./cheatsMain');

let mainWindow = null;

let rpc;

async function setActivity() {
    if (!rpc || !mainWindow) {
        return;
    }

    const activity = { 
        instance: false, 
        startTimestamp, 
        state: "Cheating on Assault Cube...",
        largeImageKey: "logoimg",
        largeImageText: "Logo",
        smallImageKey: "chatimg",
        smallImageText: "Aimbotting...",
    }; 

    rpc.setActivity(activity);
}

function discordRPC(clientId) {
    if (rpc) {
        rpc.clearActivity();
        rpc.destroy();
        rpc = undefined;
    }
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    rpc.on('ready', () => {
        setActivity();

        setInterval(() => {
            setActivity();
        }, 15e3);
    });

    startTimestamp = new Date();
    rpc.login({ clientId });
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
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
        if(client == null) return;
        client.disconnect();
    });

    mainWindow.on("ready-to-show", async () => {
        mainWindow.webContents.openDevTools();

    });

}

app.whenReady().then(async () => {

    discordRPC("1229541932431179797");

    ipcMain.on('close', (event) => {
        app.quit();
    });

    ipcMain.on('minimize', (event) => {
        mainWindow.minimize();
    });
    
    if (mainWindow === null){
        createWindow();    
        if (process.platform === 'win32')
        {
            app.setAppUserModelId("AssaultCubeJSx");
        }    

        startCheatsLogic();
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
