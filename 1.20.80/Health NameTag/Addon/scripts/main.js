/** ------------------------------------- */
import { world, ScoreboardIdentity, ScoreboardIdentityType, system, Player, Entity } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
/** _________________________________________________________ */
function capitalizeFirstLetter(match) {
    return match.toUpperCase();
}
/** _________________________________________________________ */
function bettertypeId(str) {
    str = str.replace("minecraft:", "").replace(/_/g, " ").toLowerCase();
    str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
    str = str.replace("Pa:", "").replace(/_/g, " ").toLowerCase();
    str = str.replace(/\b[a-z]/g, capitalizeFirstLetter);
    return str;
}
/** _________________________________________________________ */
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
/** _________________________________________________________ */
function updateEntityNameTag(entity) {
    let hps = entity.getComponent("health").currentValue;
    const hp = Math.ceil(hps);
    const max = hps.value;
    const damage = Math.abs(max - hp);
    const Display_HP = (hp < 0 ? (hp < damage ? 0 : 1) : hp) ?? 0;
    const TargetName = bettertypeId(entity.typeId);
    let nameTag = entity.nameTag || TargetName || "Monster";
    if (!nameTag.includes('')) {
        nameTag = `§7${nameTag}§f\n§c${Display_HP} §4❤§r`;
    } else {
        let enName = nameTag.split("")[1];
        nameTag = `§7${enName}§f\n§c${Display_HP} §4❤§r`;
    }
    entity.nameTag = nameTag;
}
/** _________________________________________________________ */
world.afterEvents.entitySpawn.subscribe(data => {
    try {
        let mob = data.entity;
        if (mob.typeId.includes('player')) return;
        updateEntityNameTag(mob);
    } catch (UwU) { }
});
/** _________________________________________________________ */
world.afterEvents.entityHurt.subscribe(data => {
    try {
        let mob = data.hurtEntity;
        if (mob.typeId.includes('player')) return;
        updateEntityNameTag(mob);
    } catch (UwU) { }
});
/** _________________________________________________________ */