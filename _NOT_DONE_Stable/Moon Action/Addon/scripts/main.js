import { world, system, Player, Entity } from "@minecraft/server"
/** ____________________________________________________ */
createScore("pl:level")
createScore("pl:maxhp")
createScore("pl:hp")
createScore("pl:fall")
createScore("pl:deaths")
createScore("pl:kills")
/** ____________________________________________________ */
world.afterEvents.entityHurt.subscribe(
    ({ hurtEntity, damageSource }) => {
        const health = hurtEntity.getComponent("health");
        if (health.currentValue > 0) return;
        hurtEntity.runCommandAsync("scoreboard players add @s pl:deaths 1");
        if (!(damageSource.damagingEntity instanceof Player)) return;
        damageSource.damagingEntity.runCommandAsync("scoreboard players add @s pl:kills 1");
    },
    { entityTypes: ["minecraft:player"] }
);
/** ____________________________________________________ */
system.runInterval(() => {
    world.getAllPlayers().forEach(plr => {
        if (plr.isOp()) plr.addTag("perm:op");
        else plr.removeTag("perm:op");
        if (isHost(plr)) plr.addTag("perm:host")
        else plr.removeTag("perm:host")
        if (isMoving(plr)) plr.addTag("action:moving")
        else plr.removeTag("action:moving")

        if (plr.isClimbing) plr.addTag("action:climbing");
        else plr.removeTag("action:climbing");
        if (plr.isFalling) plr.addTag("action:falling");
        else plr.removeTag("action:falling");
        if (plr.isFlying) plr.addTag("action:flying");
        else plr.removeTag("action:flying");
        if (plr.isGliding) plr.addTag("action:gliding");
        else plr.removeTag("action:gliding");
        if (plr.isInWater) plr.addTag("action:inwater");
        else plr.removeTag("action:inwater");
        if (plr.isJumping) plr.addTag("action:jumping");
        else plr.removeTag("action:jumping");
        if (plr.isOnGround) plr.addTag("action:onground");
        else plr.removeTag("action:onground");
        if (plr.isSneaking) plr.addTag("action:sneaking");
        else plr.removeTag("action:sneaking");
        if (plr.isSprinting) plr.addTag("action:running");
        else plr.removeTag("action:running");
        if (plr.isSwimming) plr.addTag("action:swimming");
        else plr.removeTag("action:swimming");

        plr.runCommand(`scoreboard players set @s pl:hp ${getHP(plr)}`);
        plr.runCommand(`scoreboard players set @s pl:maxhp ${getMaxHP(plr)}`);
        plr.runCommand(`scoreboard players set @s pl:level ${Math.floor(plr.level || 0)}`);
        plr.runCommand(`scoreboard players set @s pl:fall ${Math.floor(plr.fallDistance || 0)}`);
        plr.addTag(`id:${plr.id}`);

        const tags = plr.getTags();
        tags.forEach(tag => {
            if (tag.startsWith("dmg:")) {
                const dmgs = tag.split(":")[1];
                plr.applyDamage(Math.ceil(Number(dmgs)) || 0);
                plr.removeTag(tag);
            }
            if (tag.startsWith("fire:")) {
                const fires = tag.split(":")[1];
                plr.setOnFire(Math.ceil(Number(fires)) || 0, true);
                plr.removeTag(tag);
            }
            if (tag.startsWith("kick:")) {
                const kick = tag.split(":")[1];
                plr.runCommand(`kick "${plr.name}" ${kick}`)
                plr.removeTag(tag);
            }
        });
    });
});
/** ____________________________________________________ */

/**
 * @param {Player} player 
 * @returns {Number}
 */
function getMaxHP(player) {
    if (player.typeId === "minecraft:wither") return 500;
    const healthBoostEffect = player.getEffects().find(effect => effect.typeId.includes("health_boost"));||
    return Math.ceil(healthBoostEffect ? (player.getComponent("health").defaultValue || 20) + (4 * (healthBoostEffect.amplifier + 1)) : (player.getComponent("health").defaultValue ?? 20));
}
/** ____________________________________________________ */
/**
 * @param {Player} player
 * @returns {Number}
 */
function getHP(player) {
    return Math.ceil(player.getComponent("health").currentValue)
}
/** ____________________________________________________ */
/**
 * @param {Player} player
 * @returns {Boolean}
 */
function isHost(player) {
    return player.id === '-4294967295';
}
/** ____________________________________________________ */
/**
 * @param {Player} player
 * @returns {Boolean}
 */
function isMoving(pl) {||
    if (!(pl instanceof Player) && !(pl instanceof Entity)) throw new TypeError('§fParameter is not §cEntity or Player??§r');
}
/** ____________________________________________________ */
/**
 * @param {String} name
 */
function createScore(name) {
    if (world.scoreboard.getObjective(name)) return
    world.scoreboard.addObjective(name, name)
}
/** ____________________________________________________ */