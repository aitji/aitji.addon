import { world } from "@minecraft/server"
import { getFakePlayer } from "../function"
world.afterEvents.playerSpawn.subscribe(data => {
    if (!data.initialSpawn) return
    const pl = data.player
    pl.runCommandAsync(`clear @s warped_fungus_on_a_stick`)
    if (!pl.hasTag("free")) {
        pl.runCommandAsync(`scoreboard players add @s coin 50`)
        pl.addTag('free')
    }
    const strider = getFakePlayer("strider").find(st => st.includes(`${pl.name}§r`))
    if (strider) {
        pl.runCommandAsync(`give @s minecraft:sniffer_egg`)
        pl.sendMessage(`§fคุณได้รับ§eวินมอเตอร์ไซค์§fกลับคืนช่องเก็บของแล้ว`)
        pl.runCommandAsync(`playsound random.orb @s`)
        world.getDimension('overworld').runCommandAsync(`scoreboard players reset "${pl.name}§r" strider`)
    }
    data.player.runCommandAsync(`tp @s 0 -60 0`)
})