import { world, system, ScoreboardIdentityType } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
/** -------------------------------- */
export function getStyle(pl) {
    let style = `§h`
    if (pl.hasTag("Admin")) style = `§c`
    if (pl.hasTag("build")) style = `§e`
    return style
}
/** -------------------------------- */
export function bettertypeId(str) {
    try {
        str = str.replace("minecraft:", "").replace(/_/g, " ").toLowerCase();
        str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
        str = str.replace("Pa:", "").replace(/_/g, " ").toLowerCase();
        str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
        str = str.replace("Cos:", "").replace(/_/g, " ").toLowerCase();
        str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
        str = str.replace("Cmg:", "").replace(/_/g, " ").toLowerCase();
        str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
        return str;
    } catch (e) { }
}
function capitalizeFirstLetter(letter) { return letter.toUpperCase(); }
/** -------------------------------- */
export function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) ?? 0
        }
        return obj.getScore(target.scoreboardIdentity) ?? 0
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
export function calculateDistance(x1, y2, z3, x4, y5, z6) {
    const distance = Math.sqrt(
        Math.pow(x1 - x4, 2) +
        Math.pow(y2 - y5, 2) +
        Math.pow(z3 - z6, 2)
    );

    return distance.toFixed(0)
}
/** -------------------------------- */
export async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    while ((system.currentTick - startTick) < timeout) {
        const response = await form.show(player);
        if (response.cancelationReason !== FormCancelationReason.UserBusy) {
            return response;
        }
    }
    throw new Error(`Timed out after ${timeout} ticks`);
}
/** -------------------------------- */
/**
 * @param {String} objectiveId 
 * @returns {Array}
 */
export function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName)
}
/** -------------------------------- */