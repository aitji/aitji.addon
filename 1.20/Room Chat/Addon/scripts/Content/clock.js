import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { getStyle } from "../functions";
import { mainshops } from "../Button/shop";
/** -------------------------------------------------------- */
world.beforeEvents.itemUse.subscribe(data => {
    const pl = data.source
    const item = data.itemStack

    if (item.typeId === "minecraft:clock") {
        mains(pl)
    }
})
/** -------------------------------------------------------- */
function mains(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §fเมนู ${getStyle(pl)}${pl.name}§r§l §e«`)
        form.body(`§l§a» §fเลือกสิ่งที่คุณต้องการใน§aหน้าเมนู§fนี้!\n§e» §fแนะนำให้ทำความ§eคุ้นเคย§f\n  จะทำให้ประสบการณ์เล่น§eดีขึ้น!`)
        form.button(`§l§eร้านค้า\n§7กดที่นี่`, `textures/ui/sidebar_icons/marketplace`)
        form.button(`§l§bเทเลพอร์ต\n§7กดที่นี่`, `textures/ui/sidebar_icons/realms`)
        if(pl.hasTag("cam")) form.button(`§l§fมุมกล้องใหม่\n§7กดที่นี่เพื่อ §4ปิด`, `textures/ui/camera-yo`)
        else form.button(`§l§fมุมกล้องใหม่\n§7กดที่นี่เพื่อ §2เปิด`, `textures/ui/camera-yo`)
        form.show(pl).then(res => {
            if (res.selection === 0) mainshops(pl)
            if (res.selection === 1) teleport(pl)
            if (res.selection === 2) {
                pl.runCommandAsync(`camera @s fade time 0.1 0.3 0.2`)
                pl.runCommandAsync(`playsound random.pop @s`)
                if(pl.hasTag("cam")) pl.runCommandAsync(`tag @s remove cam`)
                else pl.runCommandAsync(`tag @s add cam`)
            }
        })
    })
}
/** -------------------------------------------------------- */
const tpname = [
    `§l§nกลับ§6บ้าน`,
    `§l§9เหมือง§fปลา`
]
const tpxyz = [
    `21.50 -60.00 32.50`,
    `111.50 61.00 110.50`
]
const tptexture = [
    `textures/icons/home`,
    `textures/icons/fish`
]
/** -------------------------------------------------------- */
function teleport(pl) {
    system.run(() => {
        const form = new ActionFormData()
        form.title(`§l§e» §fการ§bเทเลพอร์ต §e«`)
        form.body(`§l§b» §fต้องการ §bเทเลพอร์ต §fไปที่ใหนหรอ`)
        for (let i = 0; i < tpname.length; i++) form.button(`§l${tpname[i]}\n§7กดที่นี่`, tptexture[i])
        form.show(pl).then(res => {
            if (res.canceled) return
            pl.runCommandAsync(`effect @s blindness 1 255 true`)
            pl.sendMessage(`§l§bเทเลพอร์ต §fไปยัง ${tpname[res.selection] ?? `§l§cไม่สามารถหค่าได้..§r§f§l`} §r§l§fสำเร็จแล้ว`)
            pl.runCommandAsync(`tp @s ${tpxyz[res.selection]}`)
            pl.runCommandAsync(`playsound random.orb @s`)
        })
    })
}
/** -------------------------------------------------------- */