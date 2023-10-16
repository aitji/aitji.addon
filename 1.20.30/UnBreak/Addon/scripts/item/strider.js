import { EntityDamageCause, Player, system, world } from "@minecraft/server"
import { MessageFormData } from "@minecraft/server-ui"
import { applyDash, calculateDistance, forceShow, getItems, getScore } from "../function"
/** ___________________________________________________ */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack
    if (item.typeId === "minecraft:sniffer_egg") {
        sure(pl)
    }
})
/** ___________________________________________________ */
/**
 * @param {Player} pl 
 */
export function sure(pl) {
    const en = Array.from(world.getDimension("overworld").getEntities()).find(en => en.typeId.includes("strider") && en.nameTag.split("'s")[0].includes(pl.name))
    if (en) {
        pl.sendMessage(`§fคุณมี §eวินมอเตอร์ไซค์ §fอยู่แล้ว (เรียก §eวินมอเตอร์ไซค์ §fคุณมาแล้ว)`)
        pl.runCommandAsync(`tp @s ~~-1~`)
        pl.runCommandAsync(`ride @s start_riding @e[type=strider,name="${en.nameTag}"] teleport_ride`)
        pl.runCommandAsync(`playsound random.pop @s`)
        return
    }
    system.run(() => {
        const form = new MessageFormData()
        form.title(`§fเรียก §eวินมอเตอร์ไซค์`)
        form.body(`§f${pl.name} คุณต้องการเรียก§eวินมอเตอร์ไซค์\n§fจริง ๆ ใช่ไหม`)
        form.button2(`§aใช่แล้ว`)
        form.button1(`§cยัง ๆ`)
        forceShow(pl, form).then(res => {
            if (res.selection === 1) {
                pl.runCommandAsync(`scoreboard players add @s winMxtexrsikh 1`)
                if (getScore("winMxtexrsikh", pl, true) >= 10) {
                    pl.runCommandAsync(`playsound random.break @s`)
                    pl.sendMessage(`§eวินมอเตอร์ไซค์ §fไม่สามารถใช้งานได้แล้ว`)
                    pl.runCommandAsync(`clear @s minecraft:sniffer_egg 0 1`)
                    pl.runCommandAsync(`scoreboard players reset @s winMxtexrsikh`)
                    return
                }
                pl.sendMessage(`§fใช้ §eวินมอเตอร์ไซค์ §fได้อีก: §c${usage[getScore("winMxtexrsikh", pl, true) + 1]}`)
                if (getItems(pl, "minecraft:sniffer_egg") === 0) {
                    pl.sendMessage(`§cServer Lag: §fเซิฟร์เวอร์แลคทำให้มีข้อผิดพลาด..`)
                    return
                }
                pl.runCommandAsync(`clear @s warped_fungus_on_a_stick`)
                pl.runCommandAsync(`summon strider ~~~ ~ ~ minecraft:on_saddled "§f${pl.name}'s §eวินมอเตอร์ไซค์"`)
                pl.runCommandAsync(`clear @s minecraft:sniffer_egg 0 1`)
                pl.runCommandAsync(`playsound random.orb @s`)
                pl.runCommandAsync(`give @s warped_fungus_on_a_stick`)
                pl.runCommandAsync(`tp @s ~~-1~`)
                pl.runCommandAsync(`ride @s start_riding @e[type=strider,name="§f${pl.name}'s §eวินมอเตอร์ไซค์"] teleport_ride`)
            }
        })
    })
}
/** ___________________________________________________ */
world.afterEvents.entityHitEntity.subscribe(data => {
    const pl = data.damagingEntity
    const en = data.hitEntity
    if (pl.typeId === "minecraft:player" && en.typeId === "minecraft:player") {
        if (en.hasTag("build")) return

        applyDash(en, 1, -0.8, pl)
        if (pl.isJumping) en.applyDamage(2)
        else en.applyDamage(1)
    }
    const strider = en.typeId.includes("strider") && en.nameTag.split("'s")[0].includes(pl.name)
    if (strider) {
        en.runCommandAsync(`tp @s ~~-100~`)
        en.addTag("system:kill")
        en.runCommandAsync(`kill @s`)

        pl.runCommandAsync(`clear @s warped_fungus_on_a_stick`)
        pl.runCommandAsync(`give @s minecraft:sniffer_egg`)
        pl.sendMessage(`§fเรียก§eวินมอเตอร์ไซค์§fกลับคืนช่องเก็บของแล้ว`)
        pl.runCommandAsync(`playsound random.orb @s`)
        return
    }
    const strider2 = en.typeId.includes("strider") && !en.nameTag.split("'s")[0].includes(pl.name)
    if (strider2) {
        pl.sendMessage(`§fนี่ไม่ใช่§eวินมอเตอร์ไซค์§fของคุณ`)
        pl.runCommandAsync(`playsound random.pop @s`)
        return
    }
})
/** ___________________________________________________ */
world.afterEvents.playerLeave.subscribe((data) => {
    const pl = data.playerName
    const en = Array.from(world.getDimension("overworld").getEntities()).find(en => en.typeId.includes("strider") && en.nameTag.split("'s")[0].includes(pl))
    if (en) {
        world.getDimension('overworld').runCommandAsync(`scoreboard players set "${pl}§r" strider 1`)
        en.runCommandAsync(`tp @s ~~-100~`)
        en.addTag("system:kill")
        en.runCommandAsync(`kill @s`)
    }
})
/** ___________________________________________________ */
world.afterEvents.entityDie.subscribe(data => {
    const en = data.deadEntity
    if (!en.typeId.includes("strider")) return
    const pl = world.getAllPlayers().find(plr => en.nameTag.split("'s")[0].includes(plr.name))
    if (!pl) return
    if (en.hasTag("system:kill")) return
    pl.runCommandAsync(`clear @s warped_fungus_on_a_stick`)
    pl.runCommandAsync(`give @s minecraft:sniffer_egg`)
    pl.sendMessage(`§eวินมอเตอร์ไซค์§fของคุณจมน้ำ: เก็บ§eวินมอเตอร์ไซค์§fเข้ากระเป๋าแล้ว`)
    pl.runCommandAsync(`playsound random.orb @s`)
})
/** ___________________________________________________ */
const usage = [
    "§7||||||||||",
    "§a|§7|||||||||",
    "§a||§7||||||||",
    "§a|||§7|||||||",
    "§a||||§7||||||",
    "§a|||||§7|||||",
    "§a||||||§7||||",
    "§a|||||||§7|||",
    "§a||||||||§7||",
    "§a|||||||||§7|",
    "§a||||||||||",
]