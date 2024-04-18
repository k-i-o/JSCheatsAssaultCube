const memoryjs = require('./libs/memoryjs/index');
const dataManager = require('./offsets');
const { sleep } = require('./utils');

class CheatsMain {

    constructor() {
        this.infiniteAmmo = false
        this.startCheatsLogic();
    }

    initializeBaseAndOffsets() {
        const ac_client = memoryjs.openProcess("ac_client.exe");

        dataManager.base = ac_client.modBaseAddr;
        dataManager.handle = ac_client.handle;

        // player pointer
        dataManager.player.pointer = memoryjs.readMemory(dataManager.handle, dataManager.base + dataManager.player.address.base, memoryjs.INT);

        // player ammo
        dataManager.player.address.ammo = memoryjs.readMemory(dataManager.handle, dataManager.player.pointer + dataManager.player.offsets.ammo, memoryjs.INT);

    }

    startCheatsLogic() {

        this.initializeBaseAndOffsets();

        while (true) {
            
            if(!memoryjs.isProcessRunning(ac_client.handle)) {
                break;
            }

            if(this.infiniteAmmo) {
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.ammo, 1000, memoryjs.INT);
            }

            sleep(100);
        }
        
        memoryjs.closeProcess(ac_client.handle);
    }

}

module.exports = CheatsMain