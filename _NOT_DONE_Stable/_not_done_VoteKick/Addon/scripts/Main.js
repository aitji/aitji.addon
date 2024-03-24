import { Player, ScoreboardIdentityType, system, world } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
world.sendMessage(`§l§8| §r§fVoteKick has been §cReloaded!!`)
createScore("vote")
createScore("vote_res")
createScore("vote_time")
function createScore(scoreboardName) {
    if (world.scoreboard.getObjective(scoreboardName)) return
    world.scoreboard.addObjective(scoreboardName, scoreboardName)
}

/**
 * @param {String} objective 
 * @param {Player} target 
 * @param {boolean} useZero 
 * @returns {number}
 */
function getScore(objective, target, useZero = true) {
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
/**
 * @param {String} objectiveId 
 * @returns {Array}
 */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.FakePlayer)
        .map(data => data.displayName);
}

world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack
    if (item.typeId === "minecraft:paper") main(pl)
})

/**
 * @param {Player} pl
 */
function main(pl) {
    system.run(() => {
        const pl_all = world.getAllPlayers().filter(plr => !plr.hasTag("Admin"))
        const name_ar = pl_all.filter(plr => !plr.hasTag("Admin")).map(plr => plr.name)
        const form = new ActionFormData()
        form.title(`§lVote §rKick~`)
        form.body(`§7»§f Select a player you want\nto vote §ckick §fthem~`)
        for (let i = 0; i < pl_all.length; i++) form.button(`${name_ar[i]}\nVote: ${(((getScore("vote", pl_all[i], true) || 0) / pl_all.length) * 100).toFixed(1)}%% | ${getScore("vote", pl_all[i], true) || 0}`, ["textures/ui/dressing_room_customization", `textures/ui/friend1_black_outline`, `textures/ui/Friend2`][Math.floor(Math.random() * 3)])
        form.show(pl).then(res => {
            if (res.canceled) return
            profile(pl, pl_all[res.selection], pl_all)
        })
    })
}

/**
 * @param {Player} pl
 * @param {Player} entity 
 * @param {Array} pl_all 
 */
function profile(pl, entity, pl_all) {
    system.run(() => {
        const form = new ActionFormData()
        const vote = getScore("vote", entity, true) || 0
        // player:reason:by:an 0:1:2:3
        const reason = getFakePlayer("vote_res").filter(t => t.split("⌁")[0] === entity.name);
        let display = "";

        if (reason.length <= 0) {
            if (vote === 0) display = `§8» §fnobody voted for this guy :3`;
            else display = `§8» §fnobody wrote a reason for this guy!`;
        } else {
            for (let i = 0; i < reason.length; i++) {
                const parts = reason[i].split("⌁");
                let count = 1
                if (typeof parts[1].trim() === "") continue
                let name = parts[2]
                if (parts[3] === "1") name = "Anonymous"
                display = display + `§8» §f${count}:§r <${name}> ${parts[1]}\n`;
            }
        }
        form.title(`§lVote §rKick~`)
        form.body(`§7» §fPlayer Name: §7${entity.name}§r\n§7» §fVote: ${((vote / pl_all.length) * 100).toFixed(1)}%% | ${vote}\n§7» §fReason:\n${display}`)
        form.button(`§lVote\n§r${entity.name}`, `textures/ui/hammer_l`)
        form.button(`Return`, `textures/ui/realms_red_x`)
        form.show(pl).then(res => {
            if (res.selection === 0) {
                if (reason.some(r => r.split("⌁")[2] === pl.name)) {
                    pl.sendMessage(`§fSorry, you've already voted for this guy~`);
                    return
                } else {
                    if (entity.name === pl.name) {
                        pl.sendMessage(`Chill bro, don't try to kick yourself~`);
                        return;
                    }
                    vote_(pl, entity);
                }
            }
        })
    })
}

/**
 * @param {Player} pl
 * @param {Player} entity 
 */
function vote_(pl, entity) {
    system.run(() => {
        const form = new ModalFormData()
        form.title(`§lVote §rKick~`)
        form.textField(`§7» §fPlayer Name: §7${entity.name}§r\n§fenter a reason §7(option)`, `Enter a reason (option)`)
        form.toggle(`§7» §fAnonymous?`, false)
        form.show(pl).then(res => {
            if (res.canceled) return
            let display = res.formValues[0]
            if (res.formValues[0].trim() === "") display = "none specific reason"
            if (pl.hasTag("Admin")) {
                entity.runCommandAsync(`kick "${entity.name}" §r\n§fYou was §cinstantly§r§f kicked by §cAdmin§r§f\nReason: §7${display}`)
                world.sendMessage(`§cAdmin ${pl.name} §r§fwas kick a ${entity.name} instantly because §7${display}`)
                return
            }
            if (getScore("vote_time", entity, true) === 0) {
                world.sendMessage(`${name} start a vote kick ${entity.name} for a "${display}"\neveryone can vote in a §lpaper!§r`)
            }
            pl.runCommandAsync(`scoreboard players add "${entity.name}" vote 1`)
            pl.runCommandAsync(`scoreboard players set "${entity.name}" vote_time 60`)
            let an = "0"
            let name = pl.name
            if (res.formValues[1]) an = "1"; name = "Anonymous"
            pl.runCommandAsync(`scoreboard players set "${entity.name}⌁${res.formValues[0]}⌁${pl.name}⌁${an}" vote_res 0`)
            pl.sendMessage(`You has been vote ${entity.name} for a "${display}"`)

        })
    })
}

system.runInterval(() => {
    world.getDimension('overworld').runCommandAsync(`scoreboard players remove @a[scores={vote_time=2..}] vote_time 1`)
    world.getAllPlayers().filter(plr => getScore("vote_time", plr, true) === 1).forEach(plr => {
        const pl_all = world.getAllPlayers().filter(pl => !pl.hasTag("Admin"))
        const p = Math.round((getScore("vote", plr, true) / pl_all.length) * 100)
        if (p > 50) {
            const reason = getFakePlayer("vote_res").filter(t => t.split("⌁")[0] === plr.name);
            let display = ""
            let count = 0
            for (let i = 0; i < reason.length; i++) {
                const parts = reason[i].split("⌁");
                count = count + 1
                if (typeof parts[1].trim() === "") continue
                display = display + `${parts[1]}, `;
                plr.runCommandAsync(`scoreboard players reset "${reason[i]}" vote_res`)
            }
            plr.runCommandAsync(`scoreboard players reset @s vote_time`)
            plr.runCommandAsync(`scoreboard players reset @s vote`)
            plr.runCommandAsync(`kick "${plr.name}" §r\n§fYou was vote kicked\n§fReason: §7${display.slice(0, -2)}`)
            world.sendMessage(`${p}%% of server has vote §ckick§f ${plr.name}\n${display.slice(0, -2)}`)
        } else {
            plr.runCommandAsync(`scoreboard players reset @s vote_time`)
            plr.runCommandAsync(`scoreboard players reset @s vote`)
            world.sendMessage(`${p}%% of server tried to §ckick§f ${plr.name} (didn't more 50%%)\n${display.slice(0, -2)}`)
        }
    })
}, 20)