import { world, system } from "@minecraft/server";
import { getScore, getStyle } from "../functions";
/** ------------------------------------------ */
system.runInterval(() => {
    world.getAllPlayers().forEach(pl => {
        if (pl.hasTag("cam")) if (pl.isSneaking) pl.runCommandAsync(`tag @s[tag=!sn] add sn`); else pl.runCommandAsync(`tag @s[tag=sn] remove sn`);
        const style = getStyle(pl)
        const data = [
            `§l§fชื่อของคุณ: §r${style}${pl.name}`,
            `§l§fจำนวนเงิน: §r§a${getScore("money", pl, true)}`,
            `§l§fจำนวนผู้เล่น: §r§b${world.getAllPlayers().length}/40`,
        ]
        pl.nameTag = ` §l§7${style}${pl.name} \n§fI'm too §9COOL§r`
        // pl.runCommandAsync(`titleraw @s actionbar {"rawtext":[{"translate":"${data.join("\n")}"}]}`)
    })
})
/** --------------------------------------------- */
// world.afterEvents.projectileHit.subscribe(data => {
//     try {
//         const pl = data.source
//         const pro = data.projectile
//         if (data.getEntityHit().entity.typeId === "minecraft:player") {
//             pro.runCommandAsync(`tp @s 1000 1000 1000`)
//             pl.sendMessage(`§l§fเอง§cอย่า§fซนใหญ่สิ`)
//         }
//     } catch (e) {}
// })
/** --------------------------------------------- */