/** -------------------------------- */
import { world } from "@minecraft/server"
/** @ InwAitJi Script @ */
/** -------------------------------- */
world.events.beforeChat.subscribe(data =>{
    data.cancel = true;
    let player = data.sender
    let message = data.message
    /** Easy */
    world.sendMessage(`<${player.nameTag}> ${message}`)
})