const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('eAPI', {
    close: () => ipcRenderer.send('close'),
    minimize: () => ipcRenderer.send('minimize'),
    cheat: (cheat, data = null) => ipcRenderer.send('cheat', cheat, data),
});

ipcRenderer.on('interacted', (event, name, status) => {

    const cheatList = document.querySelector(`.cheat-list`);

    if(name == 'showCS') {
        cheatList.classList.toggle('show', status);
        return;
    }

    if(name == 'crosshair') {
        const crosshair = document.querySelector('.crosshair');
        crosshair.classList.toggle('show', status);
        return;
    }

    if(name == 'crosshairColor') {
        const crosshair = document.querySelector('.crosshair svg');
        crosshair.style.stroke = status;
        return;
    }

    const cheat = document.querySelector(`#${name.toUpperCase()}`);

    if(cheat) {
        cheat.classList.toggle('on', status);
        cheat.classList.toggle('off', !status);
    } else {
        cheatList.innerHTML += `<div class="cheat">
                                    <span class="title ${status ? 'on' : 'off'}" id="${name.toUpperCase()}">${name.toUpperCase()}</span>
                                </div>`
    }
});

ipcRenderer.on('esp', (event) => {
    let canvas = document.querySelector('#render');
    let ctx = canvas.getContext('2d');

    const target = { 
        x: 100, 
        y: 200, 
    }

    //draw rectangle 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(target.x, target.y, target.x-10, target.y+10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    
    // ctx.beginPath();
    // ctx.moveTo(canvas.width / 2, 0);
    // ctx.lineTo(95, 20);
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'red';
    // ctx.stroke();
    // ctx.closePath();

});