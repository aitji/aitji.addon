import { world } from "@minecraft/server";
/** ----------------------------------------------- */
world.afterEvents.worldInitialize.subscribe(() => {
    world.sendMessage(`§l§8| §r§fServer has been §cReloaded!!`)
})