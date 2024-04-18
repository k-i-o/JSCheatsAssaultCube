const memoryjs = require('./libs/memoryjs/index');
const dataManager = require('./offsets');

class CheatsMain {

    constructor() {
        this.infiniteAmmo = false;
        this.godMode = false;

        this.startCheatsLogic();
    }

    initializeBaseAndOffsets() {
        const ac_client = memoryjs.openProcess("ac_client.exe");

        dataManager.base = ac_client.modBaseAddr;
        dataManager.handle = ac_client.handle;

        // player pointer
        dataManager.player.pointer = memoryjs.readMemory(dataManager.handle, dataManager.base + dataManager.player.address.base, memoryjs.INT);

        // player ammo
        dataManager.player.address.ammo = dataManager.player.pointer + dataManager.player.offsets.ammo;

        // player health
        dataManager.player.address.health = dataManager.player.pointer + dataManager.player.offsets.health;

    }

    startCheatsLogic() {

        this.initializeBaseAndOffsets();

        setInterval(() => {

            if(this.infiniteAmmo) {
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.ammo, 1000, memoryjs.INT);
            }

            if(this.godMode) {
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.health, 1000, memoryjs.INT);
            }

        }, 500);
        
        //memoryjs.closeProcess(dataManager.handle);
    }

}

module.exports = new CheatsMain()