import { ScoreboardIdentityType, world, system } from "@minecraft/server";
import { ModalFormData } from '@minecraft/server-ui'
try {
    world.getAllPlayers().map(pls =>pls.runCommandAsync(`scoreboard objectives add chatsettings dummy`))
    world.getAllPlayers().map(pls =>pls.runCommandAsync(`scoreboard objectives add delay dummy`))
} catch (OvO) {
    world.getAllPlayers().map(pls =>pls.runCommandAsync(`scoreboard objectives add delay dummy`))
}
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
/** --------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.fakePlayer)
        .map(data => data.displayName)
}
/** --------------------------------------------- */
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
/** --------------------------------------------- */
world.events.beforeItemUse.subscribe((data) => {
    const pl = data.source
    const item = data.item
    data.cancel = true

    if (pl.hasTag('Admin') && item.typeId === "minecraft:compass") {
        antispamui(pl)
    }
})
/** --------------------------------------------- */
function antispamui(pl) {
    /** Chat per seconds */
    let setting, text, cps
    try {
        setting = getFakePlayer('chatsettings')
        text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
        cps = getScore('chatsettings', 'cps', true)
    } catch (UwU) { }
    const form = new ModalFormData()
    form.title(`[§r §lServer Anti Spam§r ]`)
    form.slider(`\nPlease silder this for chat delay per seconds\nChat Delay`, 0, 10, 1, cps ?? 0)
    form.textField(`Warning message when spam`, `ex: Hey Hey Slow Down please`, text ?? "Slow Down please")
    form.show(pl).then(res => {
        if (res.canceled) return
        pl.runCommandAsync(`scoreboard players reset * chatsettings`)
        pl.runCommandAsync(`scoreboard players set cps chatsettings ${res.formValues[0]}`)
        pl.runCommandAsync(`scoreboard players set "text:${res.formValues[1]}" chatsettings 1`)
        pl.sendMessage(`§r§7§l| §r§fChat Per Seconds has set to §c"${res.formValues[0]}"`)
        pl.sendMessage(`§r§7§l| §r§fThe Message has set to §c"${res.formValues[1]}"`)
    })
}
/** --------------------------------------------- */
system.runInterval(() => {
    for (const pl of world.getAllPlayers()) {
        pl.runCommandAsync(`scoreboard players remove @s[scores={delay=!..0}] delay 1`)
        pl.runCommandAsync(`scoreboard players reset @s[scores={delay=..0}] delay`)
    }
}, 20)
/** --------------------------------------------- */
world.events.beforeChat.subscribe((data) => {
    const pl = data.sender
    const msg = data.message
    const mindcps = getScore('delay', pl, true)
    let setting, text, cps
    try {
        setting = getFakePlayer('chatsettings')
        text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
        cps = getScore('chatsettings', 'cps', true)
    } catch (lemmyface) { }

    if(mindcps > 0){
        pl.sendMessage(`${text} §7: §c${mindcps}`)
        data.cancel = true
        return
    }
    pl.runCommandAsync(`scoreboard players set @s delay ${cps ?? 0}`)
})
/** --------------------------------------------- */