module.exports = {
    base: null,
    handle: null, 
    player: {
        pointer: null,
        address: {
            base: 0x195404,
            pos: null,
            camRotation: null,
            health: null,
            shield: null,
            ammoPistol: null,
            ammoRiffle: null,
            ammoDoublePistol: null,
            granade: null,
        },
        offsets: {
            pos: 0x28,
            camRotation: 0x34,
            health: 0xEC,
            shield: 0xF0,
            ammoPistol: 0x12C,
            ammoRiffle: 0x140,
            ammoDoublePistol: 0x148,
            granade: 0x144,            
        }
    }
};