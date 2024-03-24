import * as mc from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
const World = mc.world
const can_edit_body = [
    `§r§fค่าหัวของผู้คน§fที่§aออนไลน์§fในเซิร์ฟเวอร์§7:§r`,
    `§r§r`,
    `§c_______________________________`,
    `§fอันดับ     ชื่อ     คะแนน`,
    `§r%leaderboard%`,
    `§c_______________________________`,
    `\n`,
    `§f%pl.name% §e%pl.score%`,
]
createScore("wanted")
createScore("wanted.setting")
function createScore(name) { if (World.scoreboard.getObjective(name)) return; World.scoreboard.addObjective(name, name); }
function getFakePlayer(obj) { return World.scoreboard.getObjective(obj).getParticipants().filter(data => data.type === mc.ScoreboardIdentityType.FakePlayer).map(data => data.displayName) }
function getScore(objective, plr, useZero = true) { try { const obj = World.scoreboard.getObjective(objective); if (typeof plr === 'string') { const participant = obj.getParticipants().find(v => v.displayName === plr); return participant ? obj.getScore(participant) : (useZero ? 0 : undefined); } else if (plr && plr.scoreboardIdentity) { return obj.getScore(plr.scoreboardIdentity) || (useZero ? 0 : undefined); } return useZero ? 0 : undefined; } catch (error) { return useZero ? 0 : undefined; } }
function wanted(pl) {
    mc.system.run(() => {
        const pl_score = getScore('wanted', pl, true) || 0
        const player_obj = World.getAllPlayers().map(plr => ({ name: plr.name, score: getScore('wanted', plr, true) || 0 }))
        const player_sort = player_obj.sort((a, b) => b.score - a.score)

        let leaderboard = '\n'
        let place = ``
        player_sort.forEach((plr, i) => {
            const ranking = i === 0 ? '§e' : (i === 1 ? '§7' : '§6')
            if (plr.name === pl.name) place = `${ranking}${i + 1}`
            leaderboard += `${ranking}${i + 1}. ${plr.name}: §e${plr.score || 0}§r\n`
        })
        const form = new ActionFormData()
        form.title(`§lอันดับ§r: ค่าหัว`)
        form.body(`${can_edit_body.join("§r\n§r").replace(/%leaderboard%/g, leaderboard).replace(/%pl\.name%/g, `${place}. ${pl.name}`).replace(/%pl\.score%/g, `${pl_score}`)}`)
        form.button(`LET §cCLOSE!`)

        form.show(pl).then((res) => {
            if (res.selection === 0) {
                return
            }
        })
    })
}

World.beforeEvents.itemUse.subscribe(data => {
    const { source, itemStack } = data
    const load = getFakePlayer("wanted.setting")
    let item = (load.find(r => r.startsWith(`typeId|`)) || "").split("typeId|")[1] || "minecraft:paper"
    if (itemStack.typeId.toLowerCase() === `${item.toLowerCase()}`) wanted(source)
    if (source.hasTag("Admin")) if (itemStack?.typeId === "minecraft:iron_sword" && itemStack?.nameTag.toLocaleLowerCase().trim().includes(`wanted`)) wanted_setting(source)
})

/**
 * @param {mc.Player} pl 
 */
function wanted_setting(pl) {
    mc.system.run(() => {
        const load = getFakePlayer("wanted.setting")
        let item = (load.find(r => r.startsWith(`typeId|`)) || "").split("typeId|")[1] || "minecraft:paper"
        let kill_got = (load.find(r => r.startsWith(`killGot|`)) || "").split("killGot|")[1] || "30"
        let steal = (load.find(r => r.startsWith(`steal|`)) || "").split("steal|")[1] || "0"

        const form = new ModalFormData()
        form.title(`§lแก้ไข§r: ค่าหัว`)
        form.textField(`ไอเทมเพื่อเปิดเมนู (ของผู้เล่น)\n§7ตัวอย่าง: minecraft:paper`, `eg: §ominecraft:paper`, item)
        form.textField(`ได้ค่าหัวตอนฆ่าคน\n§7ตัวอย่าง: 30`, `eg: §o30`, kill_got)
        form.textField(`ฆ่าแล้วขโมยค่าหัวกี่ %%\n§7ตัวอย่าง: 0`, `eg: §o0`, steal)

        form.show(pl).then((r) => {
            if (r.canceled) return
            const res = r.formValues
            let item_input = res[0] || ''
            const kill_got_input = parseInt(res[1], 10)
            const steal_input = parseInt(res[2], 10)

            if (!item_input.startsWith("minecraft")) {
                if (!item_input.includes(":")) {
                    pl.sendMessage('§cกรุณากรอกไอเทมในรูปแบบที่ถูกต้อง')
                    return false
                } else {
                    if (!item_input.includes(":")) { item_input = `minecraft:${item_input}` }
                }
            }

            if (isNaN(kill_got_input)) {
                pl.sendMessage('§cกรุณากรอกค่าหัวต่อการฆ่าคนในรูปแบบที่ถูกต้อง')
                return false
            }

            if (isNaN(steal_input) || steal_input < 0 || steal_input > 100) {
                pl.sendMessage('§cกรุณากรอกฆ่าแล้วขโมยค่าหัวในรูปแบบที่ถูกต้อง (ระหว่าง 0 ถึง 100)')
                return false
            }
            pl.runCommandAsync(`scoreboard players reset * wanted.setting`)
            pl.runCommandAsync(`scoreboard players set "typeId|${item_input}" wanted.setting 1`)
            pl.runCommandAsync(`scoreboard players set "killGot|${kill_got_input}" wanted.setting 1`)
            pl.runCommandAsync(`scoreboard players set "steal|${steal_input}" wanted.setting 1`)
            pl.sendMessage(`§r\n§fไอเทม(ผู้เล่น): §6${item}§f>§a${item_input}\n§r§fได้ค่าหัวตอนฆ่าคน: §6${kill_got}§f>§a${kill_got_input}\n§r§fฆ่าแล้วขโมยค่าหัว:§6 ${steal}§f>§a${steal_input}%`)
        })
    })
}

World.afterEvents.entityDie.subscribe(async data => {
    try {
        const ded = data.deadEntity
        const killer = data.damageSource && data.damageSource.damagingEntity

        if (!ded || !killer) { return }

        const load = getFakePlayer("wanted.setting")
        let kill_got = Number((load.find(r => r.startsWith(`killGot|`)) || "").split("killGot|")[1]) || 30
        let steal = Number((load.find(r => r.startsWith(`steal|`)) || "").split("steal|")[1]) || 0
        const ded_want = getScore("wanted", ded, true) || 0

        let percentage = Math.floor((steal / 100) * ded_want)

        if (isNaN(percentage)) percentage = 0

        const newWantedValue = Math.max(0, kill_got + percentage)
        const actualSubtraction = Math.min(ded_want, percentage)

        await killer.runCommandAsync(`scoreboard players add @s wanted ${newWantedValue}`)
        await ded.runCommandAsync(`scoreboard players remove @s wanted ${actualSubtraction}`)

        ded.sendMessage(`§7คุณถูกฆ่าโดย ${killer.name}\n§r§7สูญเสีย §c-${actualSubtraction} ค่าหัว`)
        killer.sendMessage(`§7คุณฆ่า ${ded.name}\n§r§7ได้รับ §a+${newWantedValue} ค่าหัว`)
    } catch (e) { }
})