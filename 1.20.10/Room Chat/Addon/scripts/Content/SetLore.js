import { EntityInventoryComponent, world, system } from "@minecraft/server";
import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
/** ----------------------------------------------------- */
world.beforeEvents.itemUse.subscribe(data => {
    let pl = data.source
    let item = data.itemStack
    let inv = pl.getComponent(EntityInventoryComponent.componentId).container;
    let lore = item.getLore()
    if (pl.isSneaking && pl.hasTag(`canLore`) && pl.hasTag(`Admin`)) {
        if (pl.getRotation().x > 85) {
            setloreitem2(pl, item, data, inv)
        } else {
            setloreitem1(pl, item, data, inv, lore)
        }
    }
})
/** ----------------------------------------------------- */
function setloreitem1(pl, item, data, inv, lore) {
    system.run(() => {
        let form = new ModalFormData()
        form.title(`§2</> §f${item.nameTag ?? item.typeId} §r§2</>`)
        lore.forEach((l, i) => form.textField(`Line: ${i + 1} | §r${l}§r`, "Enter lore here", l))
        form.textField("New line", "Enter new lore here")
        form.show(pl).then(r => {
            if (!r.canceled) {
                let res = r.formValues.map(r => String(`${r}`)).filter(r => r !== "")
                item.setLore(res)
                pl.sendMessage(`§7${item.nameTag ?? item.typeId}§f have Lore:\n§r§r${res}`)
                inv.setItem(pl.selectedSlot, item)
            }
        })
    })
}
/** ----------------------------------------------------- */
function setloreitem2(pl, item, data, inv) {
    system.run(() => {
        let form = new ModalFormData()
        form.title(`§2</> §f${item.nameTag ?? item.typeId} §r§2</>`)
        form.textField("New line", "Enter new lore here", item.getLore() === [] ? `` : item.getLore().join("\\n"))
        form.show(pl).then(({ canceled, formValues }) => {
            if (canceled) return
            const text = `${formValues[0]}`.split("\\n")
            item.setLore(text)
            inv.setItem(pl.selectedSlot, item)
            pl.sendMessage(`§7${item.nameTag ?? item.typeId}§f have Lore:\n\n§r§r${text.join("\n")}`)

        })
    })
}
/** ----------------------------------------------------- */