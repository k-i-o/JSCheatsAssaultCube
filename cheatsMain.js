const memoryjs = require('memoryjs');
const dataManager = require('./offsets');
const { sleep } = require('./utils');

function initializeBaseAndOffsets() {
    const ac_client = memoryjs.openProcess("ac_client.exe");

    dataManager.base = ac_client.modBaseAddr;
    dataManager.handle = ac_client.handle;

    // player pointer
    dataManager.player.pointer = memoryjs.readMemory(dataManager.handle, dataManager.base + dataManager.player.address.base, memoryjs.INT);

    // player ammo
    dataManager.player.address.ammo = memoryjs.readMemory(dataManager.handle, dataManager.player.pointer + dataManager.player.offsets.ammo, memoryjs.INT);

}

function startCheatsLogic() {

    initializeBaseAndOffsets();

    while (true) {
        
        memoryjs.writeMemory(dataManager.handle, dataManager.player.address.ammo, 1000, memoryjs.INT);

        sleep(10);
    }
    
    memoryjs.closeProcess(ac_client.handle);
}

module.exports = {
    startCheatsLogic
}