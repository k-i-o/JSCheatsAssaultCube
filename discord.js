const DiscordRPC = require('discord-rpc');

let rpc;

async function setActivity(mainWindow) {
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

function discordRPC(mainWindow, clientId) {
    if (rpc) {
        rpc.clearActivity();
        rpc.destroy();
        rpc = undefined;
    }
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    rpc.on('ready', () => {
        setActivity(mainWindow);

        setInterval(() => {
            setActivity(mainWindow);
        }, 15e3);
    });

    startTimestamp = new Date();
    rpc.login({ clientId });
}


module.exports = { discordRPC };