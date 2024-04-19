const memoryjs = require('./libs/memoryjs/index');
const dataManager = require('./offsets');
const readline = require('readline');
const keypress = require('keypress');

class CheatsMain {

    constructor() {
        this.fly = false;
        this.flySpeed = 0.1;
        this.aimbot = false;
        this.infiniteHealth = false;
        this.infiniteShield = false;
        this.infiniteAmmoPistol = false;
        this.infiniteAmmoRiffle = false;
        this.infiniteAmmoDoublePistol = false;
        this.infiniteGranade = false;

        this.keysPressed = {}; 

        keypress(process.stdin);

        process.stdin.on('keypress', (ch, key) => {
            if (key) {
                this.keysPressed[key.name] = true; 
            }
        });

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }        
        process.stdin.resume();

        this.startCheatsLogic();
    }

    isKeyPressed(keyName) {
        return this.keysPressed[keyName] || false;
    }

    initializeBaseAndOffsets() {
        const ac_client = memoryjs.openProcess("ac_client.exe");

        dataManager.base = ac_client.modBaseAddr;
        dataManager.handle = ac_client.handle;

        // player pointer
        dataManager.player.pointer = memoryjs.readMemory(dataManager.handle, dataManager.base + dataManager.player.address.base, memoryjs.INT);
      
        // player position
        dataManager.player.address.pos = dataManager.player.pointer + dataManager.player.offsets.pos;

        // player cam rotation
        dataManager.player.address.camRotation = dataManager.player.pointer + dataManager.player.offsets.camRotation;

        // player health
        dataManager.player.address.health = dataManager.player.pointer + dataManager.player.offsets.health;

        // player shield
        dataManager.player.address.shield = dataManager.player.pointer + dataManager.player.offsets.shield;

        // player ammo pistol
        dataManager.player.address.ammoPistol = dataManager.player.pointer + dataManager.player.offsets.ammoPistol;

        // player ammo riffle
        dataManager.player.address.ammoRiffle = dataManager.player.pointer + dataManager.player.offsets.ammoRiffle;

        // player ammo double pistol
        dataManager.player.address.ammoDoublePistol = dataManager.player.pointer + dataManager.player.offsets.ammoDoublePistol;

        // player granade
        dataManager.player.address.granade = dataManager.player.pointer + dataManager.player.offsets.granade;

    }

    startCheatsLogic() {

        this.initializeBaseAndOffsets();

        let tempPos = {
            x: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos, memoryjs.FLOAT),
            y: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos + 0x4, memoryjs.FLOAT),
            z: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos + 0x8, memoryjs.FLOAT),
        };

        setInterval(() => {
            tempPos = {
                x: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos, memoryjs.FLOAT),
                y: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos + 0x4, memoryjs.FLOAT),
                z: memoryjs.readMemory(dataManager.handle, dataManager.player.address.pos + 0x8, memoryjs.FLOAT),
            };

            if(this.fly) {
                if(this.isKeyPressed('w')) {
                    this.tempPos.z += 0.1;
                }

                if(this.isKeyPressed('s')) {
                    this.tempPos.z -= 0.1;
                }

                if(this.isKeyPressed('a')) {
                    this.tempPos.x -= 0.1;
                }

                if(this.isKeyPressed('d')) {
                    this.tempPos.x += 0.1;
                }

                if(this.isKeyPressed('space')) {
                    this.tempPos.y += 0.1;
                }

                if(this.isKeyPressed('control')) {
                    this.tempPos.y -= 0.1;
                }

                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.pos, tempPos.x * this.flySpeed, memoryjs.FLOAT);
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.pos + 0x4, tempPos.y * this.flySpeed, memoryjs.FLOAT);
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.pos + 0x8, tempPos.z * this.flySpeed, memoryjs.FLOAT);

            }

            if(this.infiniteAmmo) {
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.ammo, 1000, memoryjs.INT);
            }

            if(this.godMode) {
                memoryjs.writeMemory(dataManager.handle, dataManager.player.address.health, 1000, memoryjs.INT);
            }

             

        }, 500);
        
    }

}

module.exports = new CheatsMain()