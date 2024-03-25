import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
/** -------------------------------- */
/** Settings Here */
const obj = 'money'
const itemtype = 'clock'
/** -------------------------------- */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack
    if (item.typeId === `minecraft:${itemtype}`) {
        transermoney(pl)
    }
})
/** -------------------------------- */
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
/** -------------------------------- */
function transermoney(pl) {
    system.run(() => {
        /** Setup var */
        const form = new ActionFormData()
        let players = [...world.getPlayers()].map(plr => plr.name)
        let plObjective = [...world.getPlayers()].map(plr => plr)

        /** Create GUI */
        form.title(`§l§f[ §r§5T§dr§1a§bn§as§ef§6e§4r §r§l§f]`)
        form.body(`§r§l§fเลือก §eผู้เล่น §fที่ต้องการโอน §aเงิน §fให้`)
        for (let i = 0; i < players.length; i++) {
            let randoms = Math.floor(Math.random() * 2)
            let textures;
            if (randoms == 0) {
                textures = `textures/ui/icon_steve`
            }
            if (randoms == 1) {
                textures = `textures/ui/icon_alex`
            }
            let players_money = getScore(obj, players[i])
            form.button(`§8${players[i]}\n§0${players_money}§r`, textures)
        }
        form.show(pl).then(res => {
            let selection;
            if (!res.canceled) {
                selection = plObjective[res.selection]
                howmuch(pl, selection)
            }
        })
    })
}
/** -------------------------------- */
function howmuch(pl, selection) {
    system.run(() => {
        const plscore = getScore(obj, pl, true)
        const form = new ModalFormData();
        if (pl.name === selection.name) { pl.sendMessage(`§r§l§eไม่สามารถ §fโอนเงินให้ §eตัวคุณ §fเองได้§r`); pl.runCommandAsync(`playsound random.break @s`); return; }
        if (plscore <= 0) { pl.sendMessage(`§r§l§fจำนวน §eเงินน้อย §fเกิน§6ปุย§r`); pl.runCommandAsync(`playsound random.break @s`); return; }

        form.title(`§r§l§f[ §r§5T§dr§1a§bn§as§ef§6e§4r §r§l§f]§r`)
        form.textField(`§r§l§fต้องการ §eโอนเงิน §fให้ §e${selection.name} §fเท่าไร§r`, `1-${plscore}`)
        form.textField(`§r§l§fหากต้องการใส่ §eข้อความ§r`, `§lตัวอย่าง: ขอบคุณสำหรับเพรชนะ >3`)
        form.show(pl).then(res => {
            let res1 = res.formValues[0]
            let res2 = res.formValues[1]

            /** Wrong Money Check */
            if (isNaN(res1)) { pl.sendMessage(`§l§eไม่สามารถ§fทำรายการได้เนื่องจาก §eจำนวนเงิน§f ไม่สามารถเป็น §eตัวเลข §fได้§r`); pl.runCommandAsync(`playsound random.break @s`); return; }
            if (res1 === 0 || res1 === undefined) { pl.sendMessage(`§l§eไม่สามารถ§fทำรายการได้เนื่องจาก §eจำนวนเงิน§f ไม่สามารถเป็น §eตัวเลข §fได้§r`); pl.runCommandAsync(`playsound random.break @s`); return; }
            if (res1 <= 0) { pl.sendMessage(`§l§eไม่สามารถ§fทำรายการได้เนื่องจาก §eจำนวนเงิน§f มีค่าน้อยกว่า §e0§r`); pl.runCommandAsync(`playsound random.break @s`); return; }
            if (res1 > plscore) { pl.sendMessage(`§l§eไม่สามารถ§fทำรายการได้เนื่องจาก §eคุณมีเงินน้อยกว่า§f มีค่าน้อยกว่า §e${res1} §fอยู่อีกทั้งสิ้น §e${Math.abs(res1 - plscore)}§r`); pl.runCommandAsync(`playsound random.break @s`); return; }
            /** Reason Check */
            let reason;
            if (res2 === "" || typeof res1 === 'undefined') { reason = "§r§l§fไม่มี §eเหตุผล §fใดๆ§r" } else { reason = res2 }

            pl.runCommandAsync(`scoreboard players remove @s money ${res1}`)
            pl.runCommandAsync(`playsound random.levelup @s`)
            pl.sendMessage(`§l§fคุณได้ §aโอนเงิน §fให้กับ §a${selection.name} §fเป็นจำนวนเงิน §e${res1}§r`)

            selection.runCommandAsync(`scoreboard players add @s money ${res1}`)
            selection.runCommandAsync(`playsound random.levelup @s`)
            selection.sendMessage(`§l§a${pl.name} §fได้โอนเงินให้คุณ เป็นจำนวนเงิน §e${res1}\n§fโดยให้เหตุผลว่า: §e${reason}§r`)
        })
    })
}
/** -------------------------------- */