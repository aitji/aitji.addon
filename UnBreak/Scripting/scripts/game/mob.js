import { Player, ScoreboardIdentityType, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"

if (!world.scoreboard.getObjective("shop")) world.scoreboard.addObjective("shop", "shop")
if (!world.scoreboard.getObjective("shop_settings")) world.scoreboard.addObjective("shop_settings", "shop_settings")

function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target)) ?? 0
        }
        return obj.getScore(target.scoreboardIdentity) ?? 0
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
        .map(data => data.displayName)
}
world.afterEvents.entityHitEntity.subscribe(data => {
    const pl = data.damagingEntity
    const en = data.hitEntity

    let setting = getFakePlayer('shop_settings')
    let tag
    try {
        tag = setting.filter(str => str.startsWith('tag⌁')).join('').split("⌁")[1]
    } catch (UwU) { }
    if (tag === "" || tag === undefined) tag = "shop"

    if (en.hasTag(tag)) {
        main_menu(pl)
    }
})

world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack
    try {
        if ((item.typeId === "minecraft:emerald" || item.nameTag.trim().toLocaleLowerCase().includes(`shop`)) && pl.hasTag("Admin")) {
            shop_setting(pl)
        }
    } catch (e) {

    }
})

/**
 * @param {Player} pl 
 */
function shop_setting(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§r§l§fตั้งค่า: §eร้านค้า`)
        form.body(`§fสามารถตั้งค่าร้านค้าได้ที่นี่เลย~`)
        form.button(`§8§lตั้งค่า§fทั่วไป\n§7กดที่นี่`, `textures/ui/sidebar_icons/dressing_room_skins`)
        form.button(`§a§lเพิ่ม§fไอเทม\n§7กดที่นี่`, `textures/ui/sidebar_icons/bookmark`)
        form.button(`§b§lแก้ไข§fไอเทม\n§7กดที่นี่`, `textures/ui/sidebar_icons/categories`)
        form.button(`§c§lลบ§fไอเทม\n§7กดที่นี่`, `textures/ui/sidebar_icons/wish_list`)
        form.show(pl).then((res) => {
            if (res.selection === 0) general_setting(pl)
            if (res.selection === 1) create_item(pl)
            if (res.selection === 2) edit_item1(pl)
            if (res.selection === 3) del_item1(pl)
        })
    })
}

function general_setting(pl) {
    system.run(() => {
        const form = new ModalFormData()
        let setting = getFakePlayer('shop_settings')
        let obj, objtext, tag
        try {
            obj = setting.filter(str => str.startsWith('obj⌁')).join('').split("⌁")[1]
            objtext = setting.filter(str => str.startsWith('objtext⌁')).join('').split("⌁")[1]
            tag = setting.filter(str => str.startsWith('tag⌁')).join('').split("⌁")[1]
        } catch (UwU) { }
        if (obj === "" || obj === undefined) obj = "money"
        if (objtext === "" || objtext === undefined) objtext = "เหรียญ"
        if (tag === "" || tag === undefined) tag = "shop"

        form.title(`§8§lตั้งค่า§fทั่วไป\n§7กดที่นี่`)
        form.textField(`§fสกอบอร์ดของ§aจำนวนเงิน\n§7เช่น §fmoeny`, `§7เช่น §fmoeny`, obj)
        form.textField(`§fหน่วยเงินที่§eแสดงให้ผู้เล่นเห็น\n§7เช่น §fเหรียญ §7>> 15 เหรียญ`, `§7เช่น §fเหรียญ §7>> 15 เหรียญ`, objtext)
        form.textField(`§cTag §fของมอนเตอร์ที่ตีแล้วเปิดหน้าต่าง!\n§7เช่น §fshop`, tag)
        form.show(pl).then(res => {
            pl.runCommandAsync(`scoreboard players reset * shop_settings`)
            pl.runCommandAsync(`scoreboard players set "obj⌁${res.formValues[0]}" shop_settings 0`)
            pl.runCommandAsync(`scoreboard players set "objtext⌁${res.formValues[1]}" shop_settings 0`)
            pl.runCommandAsync(`scoreboard players set "tag⌁${res.formValues[2]}" shop_settings 0`)
        })
    })
}

function del_item1(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§c§lลบ§fไอเทม`)
        form.body(`§fคุณต้องการ§cลบ§fไอเทมอะไรหรอ~`)
        const store = getFakePlayer("shop")
        if (store.length === 0) {
            form.body(`§fยังไม่มี§6ไอเทม§fให้§cลบ§f~`)
            form.button(`§cย้อนกลับ\n§7กดที่นี่`, `textures/ui/sidebar_icons/capes`)
            form.show(pl).then(res => {
                if (res.selection === 0) return shop_setting(pl)
            })
            return
        }
        for (let i = 0; i < store.length; i++) {
            form.button(`${store[i].split("|")[2]}\n§r§l§e${store[i].split("|")[5]} COIN`, store[i].split("|")[3] ?? ``)
        }
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.selection
            del_item2(pl, resu, store)
        })
    })
}

function del_item2(pl, resu, store) {
    system.run(() => {
        const form = new MessageFormData()
        form.title(`§c§lลบ§fไอเทม`)
        form.body(`§r§fคุณต้องการ§cลบไอเทม §fที่มี\n\n§6TypeId: §f${store[resu].split("|")[0] ?? ""}\n§6Id: §f${store[resu].split("|")[1] ?? "0"}\n§6Name: §f${store[resu].split("|")[2] ?? ""}\n§6Icon Path: §f${store[resu].split("|")[3] ?? ""}\n§6Amount: §f${store[resu].split("|")[4] ?? "0"}\n§6Price: §f${store[resu].split("|")[5] ?? "0"}`)
        form.button2(`§r§c§lใช่แล้ว~`)
        form.button1(`§r§f§lย้อนกลับ~`)
        form.show(pl).then(re => {
            if (re.selection === 1) {
                pl.runCommandAsync(`scoreboard players reset "${store[resu]}" shop`)
                pl.runCommandAsync(`playsound random.pop @s`)
                pl.sendMessage(`§cลบแล้ว~`)
                return
            }
            if (re.selection === 0) return shop_setting(pl)
        })
    })
}

/**
 * @param {Player} pl 
 */
function create_item(pl) {
    system.run(() => {
        const form = new ModalFormData()
        form.title(`§b§lแก้ไข§fไอเทม`)
        form.textField(`\n§cคำเตือนห้ามใช้ "§l|§r§c" ในการเขียนเนื่องจากใช้ในการ\n§cบันทึกลงฐานข้อมูล!\n\n§fใส่ §6TypeId§f ของไอเทมเพื่อให้ผู้เล่น\n\n§7ตัวอย่างเช่น §fminecraft:apple§7 หรืออาจเป็น §fpa:among_us_spawn_egg§7\n\n§7หากต้องการใช้ §fstructure load\n§7ให้ใส่เป็น §fload-ชื่อของ Structure§7 เช่น §fload-apple`, `§7ตัวอย่างเช่น §fminecraft:apple`)
        form.textField(`\n§fใส่ §6ชื่อ §fของไอเทม\n§7ตัวอย่างเช่น §r§l§f§cแอปเปิ้ล §f[x16]§7`, `§7ตัวอย่างเช่น §r§l§f§cแอปเปิ้ล §f[x16]§7`)
        form.textField(`\n§fใส่ §6ไอคอน §fของปุ่มในหน้าเลือกไอเทม\n§aหากไม่มี/ไม่ต้องการ ไม่จำเป็นต้องใส่!\n\n§7ตัวอย่างเช่น §ftextures/items/apple`, `§7ตัวอย่างเช่น §ftextures/items/apple`)
        form.textField(`\n§fใส่ §6จำนวน §fของไอเทมที่ผู้เล่นจะได้รับ เช่น §716\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f16`)
        form.textField(`\n§fใส่ §6ไอดี(Id) §fของไอเทม เช่น §70\n(/give @s TypeId Count §l[ID]§r§7)\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f0`)
        form.textField(`\n§fใส่ §6ราคา §fของไอเทม เช่น §7120\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f120`)
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues
            pl.runCommandAsync(`scoreboard players set "${resu[0] ?? "minecraft:air"}|${resu[4] || "0"}|${resu[1]}|${resu[2] ?? (resu[0] ?? "minecraft:air")}|${resu[3] ?? ""}|${resu[5] ?? "0"}" shop 1`)
            pl.sendMessage(`§aเพิ่ม§fไอเทม §f${resu[0] ?? "minecraft:air"} แล้ว!`)
            pl.runCommandAsync(`playsound random.orb @s`)
        })
    })
}

function edit_item1(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§b§lแก้ไข§fไอเทม`)
        form.body(`§fคุณต้องการ§bแก้ไข§fไอเทมอะไรหรอ~`)
        const store = getFakePlayer("shop")
        if (store.length === 0) {
            form.body(`§fยังไม่มี§6ไอเทม§fให้§bแก้ไข§f~`)
            form.button(`§cย้อนกลับ\n§7กดที่นี่`, `textures/ui/sidebar_icons/capes`)
            form.show(pl).then(res => {
                if (res.selection === 0) return shop_setting(pl)
            })
            return
        }
        for (let i = 0; i < store.length; i++) {
            form.button(`${store[i].split("|")[2]}\n§r§l§e${store[i].split("|")[5]} COIN`, store[i].split("|")[3] ?? ``)
        }
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.selection
            edit_item2(pl, resu, store)
        })
    })
}

/**
 * @param {Player} pl 
 * @param {number} resula 
 * @param {Array} store 
 */
function edit_item2(pl, resula, store) {
    system.run(() => {
        const form = new ModalFormData()
        form.title(`§a§lเพิ่ม§fไอเทม`)
        form.textField(`\n§cคำเตือนห้ามใช้ "§l|§r§c" ในการเขียนเนื่องจากใช้ในการ\n§cบันทึกลงฐานข้อมูล!\n\n§fใส่ §6TypeId§f ของไอเทมเพื่อให้ผู้เล่น\n\n§7ตัวอย่างเช่น §fminecraft:apple§7 หรืออาจเป็น §fpa:among_us_spawn_egg§7\n\n§7หากต้องการใช้ §fstructure load\n§7ให้ใส่เป็น §fload-ชื่อของ Structure§7 เช่น §fload-apple`, `§7ตัวอย่างเช่น §fminecraft:apple`, store[resula].split("|")[0] ?? "")
        form.textField(`\n§fใส่ §6ชื่อ §fของไอเทม\n§7ตัวอย่างเช่น §r§l§f§cแอปเปิ้ล §f[x16]§7`, `§7ตัวอย่างเช่น §r§l§f§cแอปเปิ้ล §f[x16]§7`, store[resula].split("|")[2] ?? "")
        form.textField(`\n§fใส่ §6ไอคอน §fของปุ่มในหน้าเลือกไอเทม\n§aหากไม่มี/ไม่ต้องการ ไม่จำเป็นต้องใส่!\n\n§7ตัวอย่างเช่น §ftextures/items/apple`, `§7ตัวอย่างเช่น §ftextures/items/apple`, store[resula].split("|")[3] ?? "")
        form.textField(`\n§fใส่ §6จำนวน §fของไอเทมที่ผู้เล่นจะได้รับ เช่น §716\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f16`, store[resula].split("|")[4] ?? "")
        form.textField(`\n§fใส่ §6ไอดี(Id) §fของไอเทม เช่น §70\n(/give @s TypeId Count §l[ID]§r§7)\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f0`, store[resula].split("|")[1] ?? "")
        form.textField(`\n§fใส่ §6ราคา §fของไอเทม เช่น §7120\n\n§c* กรุณาใส่เป็นตัวเลขเท่านั้น`, `§7ตัวอย่างเช่น §f120`, store[resula].split("|")[5] ?? "")
        form.show(pl).then(res => {
            if (res.canceled) return
            const resu = res.formValues
            pl.runCommandAsync(`scoreboard players reset "${store[resula]}" shop`)
            pl.runCommandAsync(`scoreboard players set "${resu[0] ?? "minecraft:air"}|${resu[4] || "0"}|${resu[1]}|${resu[2] ?? (resu[0] ?? "minecraft:air")}|${resu[3] ?? ""}|${resu[5] ?? "0"}" shop 1`)
            pl.sendMessage(`§bแก้ไข§fไอเทม แล้ว!`)
            pl.runCommandAsync(`playsound random.orb @s`)
        })
    })
}
/** _______________________________________________ */
function main_menu(pl) {
    const form = new ActionFormData()
    const store = getFakePlayer("shop")

    let obj, objtext, tag
    try {
        obj = store.filter(str => str.startsWith('obj⌁')).join('').split("⌁")[1]
        objtext = store.filter(str => str.startsWith('objtext⌁')).join('').split("⌁")[1]
        tag = store.filter(str => str.startsWith('tag⌁')).join('').split("⌁")[1]
    } catch (UwU) { }
    if (obj === "" || obj === undefined) obj = "money"
    if (objtext === "" || objtext === undefined) objtext = "เหรียญ"
    if (tag === "" || tag === undefined) tag = "shop"
    const money = getScore(obj, pl, true)

    form.title(`§r§l§eร้านค้า`)
    form.body(`§r§f§lเลือก§eซื้อ§fของที่จะ§eช่วยเหลือ§fคุณ~§r\n§l§fตอนนี้คุณมี §e${money}${objtext}`)
    if (store.length === 0) {
        pl.sendMessage(`§fยังไม่มี§6ไอเทม§fใดวางขาย~`)
        return
    }
    for (let i = 0; i < store.length; i++) {
        form.button(`${store[i].split("|")[2]}\n§r§l§e${store[i].split("|")[5]} ${objtext}`, store[i].split("|")[3] ?? ``)
    }
    form.show(pl).then(res => {
        if (!res.canceled) {
            const form = new MessageFormData()
            form.title(`§r§l§eร้านค้า`)
            form.body(`§r§f§lเลือก§6ข้อมูล§fเกี่ยวกับสิ่งนี้\n${store[res.selection].split("|")[2].split(`\n`, 1)} §l§fราคา: §e${store[res.selection].split("|")[5]} ${objtext}`)
            form.button2(`§r§a§lซื้อเลย!`)
            form.button1(`§r§e§lย้อนกลับ`)
            const ress = res.selection
            form.show(pl).then(re => {
                if (re.selection === 1) ItemSlider(pl, ress, store)
                if (re.selection === 0) return main_menu(pl)
            })
        }

    })
}
/** _______________________________________________ */
function ItemSlider(pl, resu, store) {
    const form = new ModalFormData()
    let obj, objtext, tag
    try {
        obj = store.filter(str => str.startsWith('obj⌁')).join('').split("⌁")[1]
        objtext = store.filter(str => str.startsWith('objtext⌁')).join('').split("⌁")[1]
        tag = store.filter(str => str.startsWith('tag⌁')).join('').split("⌁")[1]
    } catch (UwU) { }
    if (obj === "" || obj === undefined) obj = "money"
    if (objtext === "" || objtext === undefined) objtext = "เหรียญ"
    if (tag === "" || tag === undefined) tag = "shop"
    const money = getScore(obj, pl, true)

    if (money < Number(store[resu].split("|")[5])) {
        pl.runCommandAsync(`playsound random.break @s ~~~ 50`)
        pl.sendMessage(`§r§l§eคุณมีเงินไม่เพียงพอ §fที่จะซื้อไอเทมนี้ คุณต้องการอีก:§e ${Number(store[resu].split("|")[5]) - money} ${objtext}`)
        return
    }
    const max = Math.floor(money / Number(store[resu].split("|")[5]))
    form.title(`§r§l§eร้านค้า`)
    form.textField(`§r§f§lต้องการไอเทมนี้มากเท่าไรหรอ\n§r${store[resu].split("|")[2].split(`\n`, 1)}`, `ใส่ได้สูงสุด: ${max}`)
    form.show(pl).then(r => {
        if (!r.canceled) {
            const res = Math.ceil(Number(r.formValues[0]));

            if (isNaN(res) || res !== parseInt(res, 10)) {
                pl.sendMessage(`§r§l§fตัวเลขไม่ถูกต้อง`);
                return;
            }
            
            if (res > max) {
                pl.sendMessage(`§r§l§eคุณมีเงินไม่เพียงพอ §fที่จะซื้อไอเทมนี้มากขนาดนั้น`);
                return;
            }
            
            pl.runCommandAsync(`scoreboard players remove @s "${obj}" ${store[resu].split("|")[5] * res}`)

            if (store[resu].split("|")[0].startsWith("load-")) for (let i = 0; i < Number(store[resu].split("|")[4]) * res; i++) pl.runCommandAsync(`structure load "${store[resu].split("|")[0].split("load-")[1]}" ~~~`)
            else pl.runCommandAsync(`give @s ${store[resu].split("|")[0]} ${Number(store[resu].split("|")[4]) * res} ${store[resu].split("|")[4] ?? "0" * res}`)

            pl.sendMessage(`§r§f§lคุณได้ทำการสั่งซื้อ §r${store[resu].split("|")[4].split(` §f`, 1)}§f§l [x${store[resu].split("|")[4] * res}] §l§fในราคา §e${store[resu].split("|")[5] * res} ${objtext}`)
        }
    })
}
/** _______________________________________________ */