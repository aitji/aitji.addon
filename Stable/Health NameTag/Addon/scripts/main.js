import { world, system, Player, Entity } from "@minecraft/server";

const bettertypeId = (str) => {
    return str.split(":")[1].split('_').map(v => v[0].toUpperCase() + v.slice(1).toLowerCase()).join(" ")
}

function updater(entity) {
    let hpCom = entity.getComponent("health").currentValue
    const hp = Math.ceil(hpCom)
    const max = hpCom.value
    const damage = Math.abs(max - hp)
    const calHP = (hp < 0 ? (hp < damage ? 0 : 1) : hp) || 0
    let nameTag = entity.nameTag || bettertypeId(entity.typeId) || "Monster"
    if (!nameTag.includes('')) {
        nameTag = `§7${nameTag}§f\n§c${calHP} §4❤§r`
    } else {
        let enName = nameTag.split("")[1]
        nameTag = `§7${enName}§f\n§c${calHP} §4❤§r`
    }
    entity.nameTag = nameTag
}

world.afterEvents.entitySpawn.subscribe(data => {
    const { entity } = data
    if (entity.typeId === "minecraft:player") return
    updater(entity)
})

world.afterEvents.entityHealthChanged.subscribe(data => {
    const { entity } = data
    if (entity.typeId === "minecraft:player") return
    updater(entity)
})