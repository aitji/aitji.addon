import { world, system, Player } from "@minecraft/server";
import { color } from "./call/function";
/** _______________________________________________________________ */
system.runInterval(() => {
    world.getAllPlayers().forEach((plr) => {
        plr.nameTag = color(plr) + plr.name;
    })
})
/** _______________________________________________________________ */
system.runInterval(() => {
    world.getDimension("overworld").runCommandAsync(`scoreboard players remove @a[scores={delay=!..0}] delay 1`)
    world.getDimension("overworld").runCommandAsync(`scoreboard players reset @a[scores={delay=..0}] delay`)
    world.getDimension("overworld").runCommandAsync(`scoreboard players add @a chatroom 0`)
}, 20)
/** _______________________________________________________________ */