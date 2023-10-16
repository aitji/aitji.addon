import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui"

const obj1 = 'rp:locar'
//————————————————————————————————————//
// Event
//————————————————————————————————————//
world.afterEvents.entityHitEntity.subscribe(data => {
    const pl = data.damagingEntity
    const entity = data.hitEntity

    if (entity.typeId === "rp:locar") {
        apple(pl)
    }
})

function apple(pl) {
    system.run(() => {
        const form = new ActionFormData();
        form.title(`unwrapping car wheels`)
        form.body(``)
        form.button(`แกะล้อรถ`) // ปุ่มที่ 0
        form.button(`ปุุ่มที่ 1`) // ปุุ่มที่ 1
        form.button(`ปุุ่มที่ 2`) // ปุุ่มที่ 2
        form.button(`ปุุ่มที่ 3`) // ปุุ่มที่ 3
        form.show(pl).then(res => {
            if (res.selection === 0) {
                // ปุ่มที่ 0 v ข้างล่างอันนี้ลบได้
                pl.runCommandAsync(`say ผมกดปุ่มที่ 0`)

                pl.runCommandAsync(`give @s diamond `)
                pl.sendMessage(`§e» §a+1 ยางรถ`)
                pl.runCommandAsync(`execute at @s run kill @e[type=${obj1},r=10,c=1]`)
            }
            if (res.selection === 1) {
                // ปุุ่มที่ 1
                pl.runCommandAsync(`say ผมกดปุ่มที่ 1`)
            }
            if (res.selection === 2) {
                // ปุุ่มที่ 2
                pl.runCommandAsync(`say ผมกดปุ่มที่ 2`)
            }
            if (res.selection === 3) {
                // ปุุ่มที่ 3
                pl.runCommandAsync(`say ผมกดปุ่มที่ 3`)
            }
        })
    })
}