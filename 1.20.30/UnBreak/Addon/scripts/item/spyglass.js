import { world } from "@minecraft/server"
import { getScore } from "../function"
world.afterEvents.itemStopUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId === "minecraft:spyglass") {
        pl.runCommandAsync(`scoreboard players add @s spyglass 1`)
        if (getScore("spyglass", pl, true) >= 9) {
            pl.runCommandAsync(`playsound random.break @s`)
            pl.sendMessage(`§cSpyglass has been broken..`)
            const inv = pl.getComponent("inventory").container;
            inv.setItem(pl.selectedSlot)
            pl.runCommandAsync(`scoreboard players reset @s spyglass`)
            return
        }
        pl.sendMessage(`§fSpyglass Usage: §c${usage[getScore("spyglass", pl, true) + 1]}`)
    }
})

const usage = [
    "§7||||||||||",
    "§a|§7|||||||||",
    "§a||§7||||||||",
    "§a|||§7|||||||",
    "§a||||§7||||||",
    "§a|||||§7|||||",
    "§a||||||§7||||",
    "§a||||||§7||||",
    "§a||||||||§7||",
    "§a|||||||||§7|",
    "§a||||||||||",
]