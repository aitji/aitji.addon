import { world } from "@minecraft/server";
/** -------------------------------- */
export function getStyle(pl) {
    let style = `§7`
    if (pl.name === "minenersGaming1") style = `§a`
    if (pl.name === "AitJi Gamer") style = `§c`
    if (pl.name === "PickerTH 12") style = `§b`

    return style
}
/** -------------------------------- */
export function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboardIdentity)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** -------------------------------- */
export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/** -------------------------------- */
export function applyDash(target, horizontalStrength, verticalStrength, pro) {
    const di = pro.getViewDirection()
    const hStrength = Math.sqrt(di.x ** 2 + di.z ** 2) * horizontalStrength
    const vStrength = di.y * verticalStrength
    target.applyKnockback(di.x, di.z, hStrength, vStrength)
}
/** -------------------------------- */
export function getItems(player, type) {
    let total = 0;
    const inv = player.getComponent("inventory").container;
    for (let i = 0; i < inv.size; i++) {
        if (inv.getItem(i)?.typeId === type) {
            total += inv.getItem(i).amount;
        }
    }
    return total;
}
/** -------------------------------- */