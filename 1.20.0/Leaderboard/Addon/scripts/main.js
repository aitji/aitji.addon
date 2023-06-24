import { ScoreboardIdentityType, scoreboardIdentity, world, system } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
system.events.beforeWatchdogTerminate.subscribe(data => data.cancel = true)
const World = world
try { world.getAllPlayers().map(pls => pls.runCommandAsync(`scoreboard objectives add setting dummy`)) } catch (e) { }
/** ------------------------------------------- */
function getFakePlayer(objectiveId) {
    return world.scoreboard
        .getObjective(objectiveId)
        .getParticipants()
        .filter(data => data.type === ScoreboardIdentityType.fakePlayer)
        .map(data => data.displayName)
}
/** ------------------------------------------- */
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
/** ------------------------------------------- */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId === "minecraft:compass") {
        let limit = getScore('setting', 'limit')
        if (limit === 0) {
            editlbs(pl)
        } else {
            try { leaderboards(pl) }
            catch (e) { editlbs(pl) }
        }
    }
})
/** ------------------------------------------- */
function leaderboards(pl) {
    system.run(() => {
        let setting = getFakePlayer('setting')
        let objs = setting.filter(str => str.startsWith('obj:')).join('')
        let text = setting.filter(str => str.startsWith('text:')).join('')
        let limit = getScore('setting', 'limit')

        let obj = objs.split(":")[1]
        let texts = text.split(":")[1]

        let mymoney = getScore(obj, pl, true)
        let form = new ActionFormData()
        let playerobj = [...World.getPlayers()].map(plr => plr)
        let name_list = [...World.getPlayers()].map(plr => plr.name)

        let score_list = []
        for (let i = 0; i < playerobj.length; i++) {
            let score = getScore(obj, playerobj[i], true)
            score_list.push(score)
        }

        const sortedPlayers = name_list.map((name, index) => ({
            name: name,
            score: score_list[index]
        })).sort((a, b) => {
            return b.score - a.score;
        }).slice(0, limit);

        let leaderboard = '\n'
        sortedPlayers.forEach((player, index) => {
            let ranking = "§8" //§r
            if (index === 0) ranking = '§e' //§r
            else if (index === 1) ranking = "§7" //§r
            else if (index === 2) ranking = "§6" //§r

            leaderboard += `§r§l${ranking}${index + 1}. ${player.name}: §e${player.score}§r\n`
        })
        let counting = `§7${limit}`;
        if (limit === 99999999) {
            counting = `§7ไม่จำกัด`
        }
        form.title(`§r§lตารางผู้นำเกี่ยวกับ §e${texts}`)
        form.body(`§r§l§fกระดานผู้นำ ทางด้าน §e${texts}§r§l§f §fทั้งหมด ${counting}§r§l§f อันดับแรก\n§fที่§aออนไลน์§fในเซิร์ฟเวอร์§7:\n§r§l§f${pl.name} §e${mymoney}\n§r§r\n§l§c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n§l§fอันดับ    ชื่อ    คะแนน\n§r${leaderboard}\n§l§c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        form.button(`§r§l§6ออก\n§7กดที่นี่`)
        if (pl.hasTag('Admin')) { form.button(`§r§l§6แก้ไข\n§8กดที่นี่§r`) }
        form.show(pl).then(res => {
            if (res.selection === 1) {
                editlbs(pl)
            }
        })
    })
}
/** ------------------------------------------- */
function editlbs(pl) {
    system.run(() => {
        if (!pl.hasTag('Admin')) {
            pl.sendMessage(`§r§l§eตารางผู้นำ§fยัง§eไม่§fถูกสร้าง..§r`)
            pl.runCommandAsync(`playsound random.break @s`)
            return
        }
        let form = new ModalFormData()

        form.title(`§lแก้ไขตารางผู้นำ`)
        form.textField(`§r§l§aสกอบอร์ด§r§lในการแสดง §7obj:..]`, `§r§lตัวอย่าง §c"obj:money"`)
        form.textField(`§r§l§6ข้อความ§r§lที่แสดง §7[text:..]`, `§r§lตัวอย่าง §c"text:เงิน"`)
        form.textField(`§r§lมากสุดกี่คน?`, `§r§lตัวเลขเท่านั้น§r`)
        form.toggle(`§r§lหรือ ไม่จำกัด §c(?)`, false)
        form.show(pl).then(r => {
            const res = r.formValues;
            if (!res.canceled) {
                let objs, text, limit
                try {
                    let setting = getFakePlayer('setting')
                    objs = setting.filter(str => str.startsWith('obj:')).join('')
                    text = setting.filter(str => str.startsWith('text:')).join('')
                    limit = getScore('setting', 'limit')
                    pl.runCommandAsync(`scoreboard players reset * setting`)
                    if (!res[0].startsWith('obj:')) pl.runCommandAsync(`scoreboard players set ${objs} setting 0`)
                    if (!res[1].startsWith('text:')) pl.runCommandAsync(`scoreboard players set ${text} setting 0`)
                    pl.runCommandAsync(`scoreboard players set limit setting ${limit}`)
                } catch (e) { }
                try { world.getAllPlayers().map(pls => pls.runCommandAsync(`scoreboard objectives add setting dummy`)) } catch (e) { }
                pl.sendMessage(`§c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
                if (res[0].startsWith('obj:')) {
                    let obj = res[0].split(":")[1]
                    pl.runCommandAsync(`scoreboard players set ${res[0]} setting 0`)
                    pl.sendMessage(`§r§l§c1) §aสกอบอร์ด §fถูกตั้งค่าเป็น §7"${res[0]}" §fหรือ §7"${obj}" §fเท่านั้น`)
                } else {
                    pl.sendMessage(`§r§l§c1) §aสกอบอร์ด §fต้องเริ่มต้นด้วย §7"obj:" §fเท่านั้น`)
                }
                /** ------------------------------------------- */
                if (res[1].startsWith('text:')) {
                    let text = res[1].split(":")[1]
                    pl.runCommandAsync(`scoreboard players set ${res[1]} setting 0`)
                    pl.sendMessage(`§r§l§e2) §6ข้อความ§fที่แสดง §fถูกตั้งค่าเป็น §7"${res[1]}" §fหรือ §7"${text}" §fเท่านั้น`)
                } else {
                    pl.sendMessage(`§r§l§e2) §6ข้อความ§fที่แสดง §fต้องเริ่มต้นด้วย §7"text:" §fเท่านั้น`)
                }
                /** ------------------------------------------- */
                if (res[3]) {
                    pl.runCommandAsync(`scoreboard players set limit setting 99999999`)
                    pl.sendMessage(`§r§l§a3) §bจำนวนคน§fที่แสดง §fถูกตั้งค่าเป็น §7"ไม่จำกัด" §fเท่านั้น`)
                } else {
                    pl.runCommandAsync(`scoreboard players set limit setting ${res[2]}`)
                    pl.sendMessage(`§r§l§a3) §bจำนวนคน§fที่แสดง §fถูกตั้งค่าเป็น §7"${res[2]}" §fเท่านั้น`)
                }
                /** ------------------------------------------- */
                pl.sendMessage(`§c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            }
        })
    })
}
/** ------------------------------------------- */