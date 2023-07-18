import { system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { getItems, getScore } from "../functions";
/** ____________________________________________ */
world.afterEvents.buttonPush.subscribe(data => {
    const pl = data.source
    const block = data.block
    if (block.location.x === 5 && block.location.y === -59 && block.location.z === 34) {
        mainshop(pl)
    }
})
/** ____________________________________________ */
function mainshop(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §fร้านค้า §e«`)
        form.body(`§r§l§a» §fต้องการ §aซื้อ§fหรือ§aขาย§f หรอ\n§e» §fนี่เป็นการ §eซื้อ/ขาย §fของสำหรับ§eเหมืองปลา§r`)
        form.button(`§l§aซื้อ!\n§7กดที่นี่`)
        form.button(`§l§cขาย\n§7กดที่นี่`)
        form.show(pl).then(res => {
            if (res.selection === 0) buy(pl)
            if (res.selection === 1) sell(pl)
        })
    })
}
export function mainshops(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §fร้านค้า §e«`)
        form.body(`§r§l§a» §fต้องการ §aซื้อ§fหรือ§aขาย§f หรอ\n§e» §fนี่เป็นการ §eซื้อ/ขาย §fของสำหรับ§eเหมืองปลา§r`)
        form.button(`§l§aซื้อ!\n§7กดที่นี่`)
        form.button(`§l§cขาย\n§7กดที่นี่`)
        form.show(pl).then(res => {
            if (res.selection === 0) buy(pl)
            if (res.selection === 1) sell(pl)
        })
    })
}
/** ____________________________________________ */
// Buy Item
const buyitemdisplay = [
    "§l§6เนื้อวัวปรุง§fไม่สุก §ix16",
    "§l§fคบ§eเพลิง §ix64",
    "§l§hหินแอนดีไซต์ §ix64",
    "§l§nที่ขุดไม้ §ix1",
    "§l§7ที่ขุดหิน §ix1",
    "§l§fที่ขุดเหล็ก §ix1",
    "§l§gที่ขุดทอง §ix1",
    "§l§bที่ขุดเพรช §ix1",
    "§l§cเอนชานต์คงทน §ix1",
    "§l§3เอนชานต์ซ่อมแซม §ix1"
]
const buyitemicon = [
    "textures/items/beef_cooked",
    "textures/blocks/torch_on",
    "textures/blocks/stone_andesite",
    "textures/items/wood_pickaxe",
    "textures/items/stone_pickaxe",
    "textures/items/iron_pickaxe",
    "textures/items/gold_pickaxe",
    "textures/items/diamond_pickaxe",
    "textures/items/book_enchanted",
    "textures/items/book_enchanted"
]
const buygive = [
    `give @s cooked_beef 16`,
    `give @s torch 64 0 {"minecraft:can_place_on":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","lava","cobblestone"]}}`,
    `give @p stone 64 5 {"minecraft:can_place_on":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","lava","cobblestone"]}}`,
    `give @s wooden_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","cobblestone"]}}`,
    `give @s stone_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","cobblestone"]}}`,
    `give @s iron_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","cobblestone"]}}`,
    `give @s golden_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","cobblestone"]}}`,
    `give @s diamond_pickaxe 1 0 {"minecraft:can_destroy":{"blocks":["stone","torch","coal_ore","iron_ore","lapis_ore","copper_ore","redstone_ore","lit_redstone_ore","gold_ore","diamond_ore","emerald_ore","cobblestone"]}}`,
    `enchant @s unbreaking 2`,
    `enchant @s mending 1`
]
const buyprice = [
    "15",
    "30",
    "50",
    "0",
    "50",
    "150",
    "35",
    "500",
    "250",
    "500"
]
/** ____________________________________________ */
// Sell Item [FISH CAVE]
const sellitemdisplay = [
    "§l§aหญ้าทะเล",
    "§l§cแซลม่อน",
    "§l§gปลาคอด",
    "§l§6แท่งไม้",
    "§l§nเนื้อเน่า",
    "§l§6ชาม",
    "§l§2ใบบัว",
    "§l§nหนังสัตว์",
    "§l§iใยแมงมุม",
    "§l§nตะขอกับดักเชือก",
    "§l§hกระดูก",
    "§l§eป้ายชื่อ",
    "§l§"
]
const sellitemicon = [
    "textures/blocks/seagrass_carried",
    "textures/items/fish_salmon_raw",
    "textures/items/fish_raw",
    "textures/items/stick",
    "textures/items/rotten_flesh",
    "textures/items/bowl",
    "textures/blocks/carried_waterlily",
    "textures/items/leather",
    "textures/items/string",
    "textures/blocks/trip_wire_source",
    "textures/items/bone",
    "textures/items/name_tag"


]
const sellitem = [
    "minecraft:seagrass",
    "minecraft:salmon",
    "minecraft:cod",
    "minecraft:stick",
    "minecraft:rotten_flesh",
    "minecraft:bowl",
    "minecraft:waterlily",
    "minecraft:leather",
    "minecraft:string",
    "minecraft:tripwire_hook",
    "minecraft:bone",
    "minecraft:name_tag"
]
const sellprice = [
    "1",
    "5",
    "5",
    "2",
    "3",
    "2",
    "3",
    "6",
    "5",
    "7",
    "5",
    "8"

]
/** ______________________________ */
// Sell Item [ORE FISHING]
const sellitemdisplay2 = [
    "§l§fยังไม่วางขาย",
]
const sellitemicon2 = [
    "textures/blocks/barrier",
]
const sellitem2 = [
    "minecraft:air",
]
const sellprice2 = [
    "0",

]
/** ____________________________________________ */
function buy(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §aซื้อ§fของ! §e«`)
        form.body(`§r§l§a» §fต้องการ §aซื้อ§fอะไรหรอ??`)
        for (let i = 0; i < buyitemdisplay.length; i++) {
            form.button(`§l§f${buyitemdisplay[i]}\n§a$${buyprice[i]}§r`, buyitemicon[i])
        }
        form.show(pl).then(res => {
            if (res.canceled) return
            const buy = res.selection
            checktosure(pl, buy)
        })
    })
}
/** ____________________________________________ */
function checktosure(pl, buy) {
    system.run(() => {
        const money = getScore("money", pl, true)
        if (money < buyprice[buy]) {
            pl.sendMessage(`§l§fจำนวนเงิน§cไม่§fเพียงพอ`)
            return
        }
        const form = new ActionFormData()
        form.title(`§l§e» §aแน่ใจ§fใหม §e«`)
        form.body(`§r§l§c» §fแน่ใจว่าจะซื้อ ${buyitemdisplay[buy]} ในราคา §c${buyprice[buy]}$\n§c» §fและคุณจะเหลือเงินทั้งสิ้น §c${Math.abs(money - buyprice[buy])}$§r`)
        form.button(`§r§a§lใช่!`)
        form.button(`§r§c§lไม่!`)
        form.show(pl).then(res => {
            if (res.selection === 0) {
                pl.runCommandAsync(`scoreboard players remove @s money ${buyprice[buy]}`)
                pl.runCommandAsync(`playsound random.orb @s`)
                pl.runCommandAsync(buygive[buy])
                pl.sendMessage(`§l§fคุณได้ทำการซื้อ: ${buyitemdisplay[buy]} ในราคา §c${buyprice[buy]}$ §fและคุณเหลือเงินทั้งสิ้น §c${Math.abs(buyprice[buy] - money)}$`)
            }
        })
    })
}
/** ____________________________________________ */
function sell(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §cขาย§fของ! §e«`)
        form.body(`§r§l§a» §l§fเลือกหมวกหมู่ของที่ต้องการขาย!`)
        form.button(`§l§9เหมือง§fปลา\n§7ของจากแร่`, `textures/icons/fish`)
        form.button(`§l§bบ่อน้ำ§fสายใยแร่\n§7ของจากปลา`, `textures/icons/ore`)
        form.show(pl).then(res => {
            if (res.canceled) return
            if (res.selection === 0) sellfish(pl)
            if (res.selection === 1) sellore(pl)
        })
    })
}
function sellfish(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §cขาย§fของ! §e«`)
        form.body(`§r§l§a» §l§fต้องการ §aขาย§fอะไรหรอ??\n\n§l§fจะนับแค่ของที่อยู่ในช่องเก็บของเท่านั้น!`)
        form.button(`§l§fขายทั้งหมด\n§aขายของทั้งหมดในตัว§r`, `textures/blocks/barrier`)
        for (let i = 0; i < sellitemdisplay.length; i++) form.button(`§l§f${sellitemdisplay[i]}\n§a$${sellprice[i]}§r`, sellitemicon[i])
        form.show(pl).then(res => {
            if (res.canceled) return
            if (res.selection === 0) {
                var moneyget = 0
                for (let i = 0; i < sellitem.length; i++) {
                    const count = getItems(pl, sellitem[i])
                    moneyget = moneyget + (count * sellprice[i])
                    pl.runCommandAsync(`clear @s ${sellitem[i]} 0 ${count}`)
                    pl.runCommandAsync(`scoreboard players add @s money ${count * sellprice[i]}`)
                    if (count < 1) {
                        pl.sendMessage(`§l§fหา ${sellitemdisplay[i]}§r§l§f ในตัวของคุณไม่เจอ..?`)
                    } else {
                        pl.sendMessage(`§l§fคุณได้ทำการขาย: ${sellitemdisplay[i]} §r§l§fจำนวน ${count} ทำให้ได้ §a${count * sellprice[i]}$`)
                    }
                }
                pl.sendMessage(`\n§l§fคุณได้เงินทั้งสิ้น §a+${moneyget}$§r`)
                pl.runCommandAsync(`playsound random.orb`)
                sell(pl)
                return
            }
            const buy = res.selection - 1
            sellhow(pl, buy)
        })
    })
}
/** ____________________________________________ */
function sellhow(pl, buy) {
    system.run(() => {
        const form = new ModalFormData()
        const count = getItems(pl, sellitem[buy])
        if (count < 1) {
            pl.sendMessage(`§l§fหา ${sellitemdisplay[buy]}§r§l§f ในตัวของคุณไม่เจอ..?`)
            return sell(pl)
        }
        form.title(`§l§e» §cเท่าไร§fหรอ! §e«`)
        form.slider(`§l§a» §fคุณต้องการ§aขาย§f ${sellitemdisplay[buy]}§r§l§f\n§fมากเท่าไรหรอ? §r§l§a`, 0, count, 1, count)
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues[0]
            pl.runCommandAsync(`clear @s ${sellitem[buy]} 0 ${resu}`)
            pl.runCommandAsync(`scoreboard players add @s money ${resu * sellprice[buy]}`)
            pl.sendMessage(`§l§fคุณได้ทำการขาย: ${sellitemdisplay[buy]} §r§l§fจำนวน ${resu} ทำให้ได้ §a${resu * sellprice[buy]}$`)
            sell(pl)
        })
    })
}
/** ____________________________________________ */
function sellore(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §cขาย§fของ! §e«`)
        form.body(`§r§l§a» §l§fต้องการ §aขาย§fอะไรหรอ??`)
        form.button(`§l§fขายทั้งหมด\n§aขายของทั้งหมดในตัว§r`, `textures/blocks/barrier`)
        for (let i = 0; i < sellitemdisplay2.length; i++) form.button(`§l§f${sellitemdisplay2[i]}\n§a$${sellprice2[i]}§r`, sellitemicon2[i])
        form.show(pl).then(res => {
            if (res.canceled) return
            if (res.selection === 0) {
                var moneyget = 0
                for (let i = 0; i < sellitem2.length; i++) {
                    const count = getItems(pl, sellitem2[i])
                    moneyget = moneyget + (count * sellprice2[i])
                    pl.runCommandAsync(`clear @s ${sellitem2[i]} 0 ${count}`)
                    pl.runCommandAsync(`scoreboard players add @s money ${count * sellprice2[i]}`)
                    if (count < 1) {
                        pl.sendMessage(`§l§fหา ${sellitemdisplay2[i]}§r§l§f ในตัวของคุณไม่เจอ..?`)
                    } else {
                        pl.sendMessage(`§l§fคุณได้ทำการขาย: ${sellitemdisplay2[i]} §r§l§fจำนวน ${count} ทำให้ได้ §a${count * sellprice2[i]}$`)
                    }
                }
                pl.sendMessage(`\n§l§fคุณได้เงินทั้งสิ้น §a+${moneyget}$§r`)
                pl.runCommandAsync(`playsound random.orb`)
                sell(pl)
                return
            }
            const buy = res.selection - 1
            sellhowore(pl, buy)
        })
    })
}
/** ____________________________________________ */
function sellhowore(pl, buy) {
    system.run(() => {
        const form = new ModalFormData()
        const count = getItems(pl, sellitem2[buy])
        if (count < 1) {
            pl.sendMessage(`§l§fหา ${sellitemdisplay2[buy]}§r§l§f ในตัวของคุณไม่เจอ..?`)
            return sell(pl)
        }
        form.title(`§l§e» §cเท่าไร§fหรอ! §e«`)
        form.slider(`§l§a» §fคุณต้องการ§aขาย§f ${sellitemdisplay2[buy]}§r§l§f\n§fมากเท่าไรหรอ? §r§l§a`, 0, count, 1, count)
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues[0]
            pl.runCommandAsync(`clear @s ${sellitem2[buy]} 0 ${resu}`)
            pl.runCommandAsync(`scoreboard players add @s money ${resu * sellprice2[buy]}`)
            pl.sendMessage(`§l§fคุณได้ทำการขาย: ${sellitemdisplay2[buy]} §r§l§fจำนวน ${resu} ทำให้ได้ §a${resu * sellprice2[buy]}$`)
            sell(pl)
        })
    })
}