import { ItemStack, world } from "@minecraft/server";
/** ---------------------------- */
/** ---------------------------- */
// Get Holding Item
const inv = (pl.getComponent('inventory')).container
const item = pl.getItem(pl.selectedSlot)
/** ---------------------------- */
// Get all Player
for (const pl of world.getPlayers()) {
    /** Code.. */
}
/** ---------------------------- */