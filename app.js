const {app, BrowserWindow, ipcMain, Notification } = require('electron')
try { require('electron-reloader')(module);} catch {};
const path = require('path');
//const { startCheatsLogic } = require('./cheatsMain');
const { OverlayController, OVERLAY_WINDOW_OPTS } = require('electron-overlay-window');
const url = require('url');
const cheatsMain = require('./cheatsMain');

let mainWindow = null;
let overlayWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 750,
        height: 400,
        icon: path.join(__dirname, 'src/assets/logo192x192.png'),
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

    // mainWindow.on("ready-to-show", async () => {
    //     mainWindow.webContents.openDevTools();

    // });

}

const createOverlayWindow = () => {
    overlayWindow = new BrowserWindow({
        ...OVERLAY_WINDOW_OPTS,
        width: 850,
        height: 650,
        resizable: false,
        transparent: true,
        icon: path.join(__dirname, 'src/assets/logo192x192.png'),
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

    ipcMain.on('close', (event) => {
        app.quit();
    });

    ipcMain.on('minimize', (event) => {
        mainWindow.minimize();
    });

    const sendStatus = (name, status) => { 
        overlayWindow.webContents.send('interacted', name, status);
    }

    ipcMain.on('cheat', (event, cheat, data = null) => {
        switch(cheat) {
            case 'attach': 
                cheatsMain.startCheatsLogic(); 
                new Notification({title: 'AssaultCubeJSx', body: 'Cheats attached!', icon: path.join(__dirname, 'src/assets/logo192x192.png')}).show(); 
                break;
            case 'showCS': 
                cheatsMain.showCS = !cheatsMain.showCS;
                sendStatus('showCS', cheatsMain.showCS);
                break;
            case 'esp': 
                cheatsMain.esp = !cheatsMain.esp;
                overlayWindow.webContents.send('esp', cheatsMain.esp); 
                sendStatus('esp', cheatsMain.esp);
                break;
            case 'crosshair':
                cheatsMain.crosshair = !cheatsMain.crosshair;     
                sendStatus('crosshair', cheatsMain.crosshair);           
                break;
            case 'crosshairColor':
                cheatsMain.crosshairColor = data;
                sendStatus('crosshairColor', cheatsMain.crosshairColor);
                break;
            case 'fly': 
                cheatsMain.fly = !cheatsMain.fly; 
                sendStatus('fly', cheatsMain.fly);
                break;
            case 'flySpeed': 
                cheatsMain.flySpeed = data; 
                break;
            case 'aimbot':  
                cheatsMain.aimbot = !cheatsMain.aimbot; 
                sendStatus('aimbot', cheatsMain.aimbot);
                break;
            case 'unlimitedHealth': 
                cheatsMain.infiniteHealth = !cheatsMain.infiniteHealth; 
                sendStatus('unlimited health', cheatsMain.infiniteHealth);
                break;
            case 'unlimitedArmor': 
                cheatsMain.infiniteArmor = !cheatsMain.infiniteArmor; 
                sendStatus('unlimited armor', cheatsMain.infiniteArmor);
                break;
            case 'unlimitedPistolAmmo': 
                cheatsMain.infiniteAmmoPistol = !cheatsMain.infiniteAmmoPistol; 
                sendStatus('unlimited pistol ammo', cheatsMain.infiniteAmmoPistol);
                break;
            case 'unlimitedRiffleAmmo': 
                cheatsMain.infiniteAmmoRiffle = !cheatsMain.infiniteAmmoRiffle; 
                sendStatus('unlimited riffle ammo', cheatsMain.infiniteAmmoRiffle);
                break;
            case 'unlimitedDoublePistolAmmo': 
                cheatsMain.infiniteAmmoDoublePistol = !cheatsMain.infiniteAmmoDoublePistol; 
                sendStatus('unlimited double pistol ammo', cheatsMain.infiniteAmmoDoublePistol);
                break;
            case 'unlimitedGrenadeAmmo': 
                cheatsMain.infiniteGranade = !cheatsMain.infiniteGranade; 
                sendStatus('unlimited granades', cheatsMain.infiniteGranade);
                break;
        }
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
        
        //notify app started
        const not = new Notification({title: 'AssaultCubeJSx', body: 'Cheat menu started!', icon: path.join(__dirname, 'src/assets/logo192x192.png')});
        not.show();

        setTimeout(() => {
            not.close();
        }, 2000);

        cheatsMain.startCheatsLogic();

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
