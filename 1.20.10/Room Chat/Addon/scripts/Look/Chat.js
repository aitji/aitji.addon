import { EntityInventoryComponent, world } from "@minecraft/server";
import { getStyle } from "../functions"
/** ---------------------------------------- */
world.beforeEvents.chatSend.subscribe(data => {
    const pl = data.sender
    const msg = data.message
    const inv = (pl.getComponent(EntityInventoryComponent.componentId)).container
    const item = inv.getItem(pl.selectedSlot)
    const style = getStyle(pl)
    data.cancel = true
    if (msg.startsWith(":cmd") && pl.hasTag("Admin")) {
        pl.runCommandAsync("tp @s 86 -60 104")
        return
    }
    if (msg.startsWith(":hub") && pl.hasTag("Admin")) {
        pl.runCommandAsync("tp @s 111 61 110")
        return
    }
    if (msg.startsWith(":hub") && pl.hasTag("Admin")) {
        pl.runCommandAsync("tp @s 0 -60 0")
        return
    }
    if (msg.startsWith(":item")) {
        pl.sendMessage(`§f§l§c- - - - - - - - - -\n§f§ฟItem Info:\n§fTypeID: §7${item.typeId ?? "NULL"}\n§fSlot: §7${pl.selectedSlot}\n§fNameTag: §7${item.nameTag ?? "NULL"}§r§l§f\n§fItemLore: §7${item.getLore().join("\n") ?? "NULL"}\n§r§l§f§c- - - - - - - - - -§r`)
        return
    }
    world.sendMessage(`§l§8| §ฟ§7${style}${pl.name}§r§l §f${msg}`)
})
/** ---------------------------------------- */