import { Player, system, world } from "@minecraft/server"
/** ______________________________________ */
/**
 * @param {Player} player 
 * @param {Number} horizontalStrength 
 * @param {Number} verticalStrength 
 */
function applyDash(player, horizontalStrength, verticalStrength) {
    system.run(() => {
        const di = player.getViewDirection();

        if (!isNaN(horizontalStrength) && !isNaN(verticalStrength)) {
            const hStrength = Math.sqrt(di.x ** 2 + di.z ** 2) * Number(horizontalStrength);
            const vStrength = di.y * Number(verticalStrength);
            player.applyKnockback(di.x, di.z, hStrength, vStrength);
        } else {
            console.error("Invalid horizontalStrength or verticalStrength");
        }
    });
}
/** ______________________________________ */
system.runInterval(() => {
    world.getAllPlayers().forEach(plr => {
        let tag = plr.getTags().find(tag => tag.startsWith("dash:"))
        if (tag) {
            plr.removeTag(tag)
            const tagParts = tag.split(":");
            const horizontalStrength = Number(tagParts[1]) ?? 0
            const verticalStrength = Number(tagParts[2]) ?? 0
            applyDash(plr, horizontalStrength, verticalStrength)
        }
    })
})
/** ______________________________________ */