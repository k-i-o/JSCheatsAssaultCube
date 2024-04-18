const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('eAPI', {
    close: () => ipcRenderer.send('close'),
    minimize: () => ipcRenderer.send('minimize'),
    maximize: () => ipcRenderer.send('maximize'),
    esp: () => ipcRenderer.send('esp'),
    infiniteAmmo: () => ipcRenderer.send('infiniteAmmo'),
})

ipcRenderer.on('esp', (event) => {
    let canvas = document.querySelector('#render');
    let ctx = canvas.getContext('2d');

    //draw rectangle 
    ctx.beginPath();
    ctx.rect(20, 20, 150, 100);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    
})