import { ScoreboardIdentityType, world, system, Player } from "@minecraft/server";
import { ModalFormData } from '@minecraft/server-ui'
import { CalDistance, color, getFakePlayer, getScore } from "./call/function";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
/** _______________________________________________________________ */
let RankPrefix = "rank:";
let def = "§7Player";
/** _______________________________________________________________ */
/**
 * 
 * @param {Player} data 
 * @returns {Boolean}
 */
function is_spam(pl) {
    system.run(() => {
        const min_cps = getScore('delay', pl, true) ?? 0
        let setting, text, cps
        try {
            setting = getFakePlayer('chatsettings')
            text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
            cps = getScore('chatsettings', 'cps', true) ?? 0
        } catch (lemmyface) { }

        if (min_cps > 0) {
            pl.sendMessage(`${text ?? ``} §7: §c${min_cps ?? 0}`)
            return true
        }
        pl.runCommandAsync(`scoreboard players set @s delay ${cps ?? 0}`)
        return false
    })
    return false
}
/** _______________________________________________________________ */
/**
 * @param {Player} pl 
 * @param {String} msg 
 */
function send_style(pl, message) {
    system.run(() => {
        let chatprefix, chatdef
        try {
            let setting = getFakePlayer('rankchat')
            chatprefix = setting.filter(str => str.startsWith('chatprefix⌁')).join('').split("⌁")[1]
            chatdef = setting.filter(str => str.startsWith('chatdef⌁')).join('').split("⌁")[1]
        } catch (UwU) { }
        let kingTag, allSeeAdmin, adminSeeAll
        try {
            let setting = getFakePlayer('chatroomSetting')
            kingTag = setting.filter(str => str.startsWith('kingTag⌁')).join('').split("⌁")[1]
            allSeeAdmin = toBool(getScore("chatroomSetting", "allSeeAdmin", true))
            adminSeeAll = toBool(getScore("chatroomSetting", "adminSeeAll", true))
        } catch (UwU) { }

        if (kingTag === "" || kingTag === undefined) kingTag = "king"
        if (allSeeAdmin === "" || allSeeAdmin === undefined) allSeeAdmin = false
        if (adminSeeAll === "" || adminSeeAll === undefined) adminSeeAll = false
        let chatroom = getScore('chatroom', pl, true) ?? 0
        if (chatprefix === "" || chatprefix === undefined) chatprefix = RankPrefix
        if (chatdef === "" || chatdef === undefined) chatdef = def
        let ranks = pl
            .getTags()
            .map((ovo) => {
                if (!ovo.startsWith(chatprefix ?? RankPrefix))
                    return null;
                return ovo.substring(chatprefix.length ?? RankPrefix.length);
            })
            .filter((uwu) => uwu)
            .join("§r§i, §r");

        let radius, messageToggle, AdminToggle, TellAdminToggle
        try {
            messageToggle = toBool(getScore("chatDistance", "messageToggle", true)) ?? false
            AdminToggle = toBool(getScore("chatDistance", "AdminToggle", true)) ?? false
            radius = getScore("chatDistance", "chatRang", true) ?? false
            TellAdminToggle = toBool(getScore("chatDistance", "TellAdminToggle", true)) ?? false
        } catch (UwU) { }
        if (radius === "" || radius === undefined || radius < 1) radius = "15"
        if (messageToggle === "" || messageToggle === undefined) messageToggle = false
        if (AdminToggle === "" || AdminToggle === undefined) AdminToggle = false
        if (TellAdminToggle === "" || TellAdminToggle === undefined) TellAdminToggle = false
        const plPosition = pl.location
        pl.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`)
        world.getAllPlayers().filter(plrs => pl.name !== plrs.name).map(plr => {
            if (plr.hasTag("Admin") && AdminToggle) {
                plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`)
                return
            }
            if (plr !== pl) {
                const plrPosition = plr.location;
                const distance = CalDistance(plPosition, plrPosition);

                if (distance <= Number(radius)) {
                    let plrchatroom = getScore('chatroom', plr, true) ?? 0
                    if (plr.hasTag(kingTag) && adminSeeAll) {
                        if (pl.hasTag(kingTag)) plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`);
                        else plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`);
                        return
                    }
                    if (pl.hasTag(kingTag) && allSeeAdmin) {
                        plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`);
                        return
                    }
                    if (plrchatroom === chatroom) {
                        if (pl.hasTag(kingTag)) plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`);
                        else plr.sendMessage(`§r§l§i[§r${ranks.length === 0 ? (chatdef ?? def) : ranks}§r§l§i]§r§f ${color(pl)}${pl.name}:§r§f ${message}`);
                        return
                    }
                }
                else {
                    if (messageToggle) plr.sendMessage(`§l§f${color(pl)}${pl.name} ได้§cส่ง§fข้อความ..`)
                    else return
                }
            }
        });
    })
}
/** _______________________________________________________________ */
world.beforeEvents.chatSend.subscribe((data) => {
    const pl = data.sender
    const msg = data.message
    data.cancel = true
    const min_cps = getScore('delay', pl, true) ?? 0
    let setting, text, cps
    try {
        setting = getFakePlayer('chatsettings')
        text = setting.filter(str => str.startsWith('text:')).join('').split(":")[1]
        cps = getScore('chatsettings', 'cps', true) ?? 0
    } catch (lemmyface) { }

    if (min_cps > 0) {
        pl.sendMessage(`${text ?? ``} §7: §c${min_cps ?? 0}`)
        return
    }
    pl.runCommandAsync(`scoreboard players set @s delay ${cps ?? 0}`)

    send_style(pl, msg)
})
/** _______________________________________________________________ */