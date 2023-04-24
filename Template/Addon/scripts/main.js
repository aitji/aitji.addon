import { world } from "@minecraft/server";
/** -------------------------------------------- */
/**
 * Get Minecraft entity/object in scoreboard [This can help you!]
 * @param {string} objective - The name of the objective.
 * @param {string|object} target - The target to retrieve the score for. It can be a player's display name or a scoreboard object.
 * @param {boolean} useZero - If true, returns 0 when an error occurs. Otherwise, returns NaN.
 * @returns {number} - The score of the objective and target.
 */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboard)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** -------------------------------------------- */