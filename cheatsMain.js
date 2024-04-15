const memoryjs = require('memoryjs');
const dataManager = require('./offsets');

function initializeBaseAndOffsets() {
    const ac_client = memoryjs.openProcess("ac_client.exe");

    dataManager.base = ac_client.modBaseAddr;
    dataManager.handle = ac_client.handle;

    // player pointer
    dataManager.player.pointer = memoryjs.readMemory(dataManager.handle, dataManager.base + dataManager.player.address.base, "int");

    // player ammo
    dataManager.player.address.ammo = memoryjs.readMemory(dataManager.handle, dataManager.player.pointer + dataManager.player.offsets.ammo, "int");

}

function startCheatsLogic() {

    initializeBaseAndOffsets();
    
    memoryjs.closeProcess(ac_client.handle);
}

module.exports = {
    startCheatsLogic
}