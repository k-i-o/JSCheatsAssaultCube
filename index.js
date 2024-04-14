const memoryjs = require('memoryjs');
const { player_static_address, player_ammo } = require('./offsets');

const ac_client = memoryjs.openProcess("ac_client.exe");

const base = ac_client.modBaseAddr;
const handle = ac_client.handle;

const playerBasePtr = memoryjs.readMemory(handle, base + player_static_address, "int");

const ammo = memoryjs.readMemory(handle, playerBasePtr + player_ammo, "int");

console.log(ammo);

memoryjs.writeMemory(handle, playerBaseAddress + player_ammo, 10000, "int");

memoryjs.closeProcess(ac_client.handle);