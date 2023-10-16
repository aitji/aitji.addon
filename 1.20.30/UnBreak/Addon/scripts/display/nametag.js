import { world, system, EntityDamageCause } from "@minecraft/server"
import { applyDash, calculateDistance, getScore, getStyle } from "../function"
/** x_________________________________________________x */
system.runInterval(() => {
    world.getAllPlayers().forEach(pl => {
        pl.nameTag = `§l§f»§r§l ${getStyle(pl)}${pl.name} §r§l§f«\n§r§eCoin(s): §r§f${getScore("coin", pl, true)}`
        let var_x = pl.getRotation().x
        let var_y = pl.getRotation().y
        pl.runCommandAsync(`scoreboard players set @s x ${Math.floor(pl.location.x)}`)
        pl.runCommandAsync(`scoreboard players set @s z ${Math.floor(pl.location.z)}`)
        if (pl.isInWater && !pl.hasTag("build")) {
            pl.setRotation({ x: -50, y: 0 })
            applyDash(pl, getScore("game", "x", true), (getScore("game", "y", true) / 10), pl)
            pl.setRotation({ x: var_x, y: var_y })
            const dmg = Math.abs(calculateDistance(0, pl.location.y, pl.location.z, 0, -60, 0) / 50)
            pl.applyDamage(Math.ceil(dmg), { cause: EntityDamageCause.flyIntoWall })
        }
        if (pl.hasTag("going")) {
            pl.setRotation({ x: -50, y: 0 })
            applyDash(pl, -1, 0, pl)
            pl.setRotation({ x: var_x, y: var_y })
            pl.removeTag("going")
        }
        if (pl.hasTag("build")) return
        if (pl.isSprinting) {
            if (!pl.hasTag("sprinting")) {
                pl.runCommandAsync(`playsound random.pop @s`)
            }
            pl.addTag("sprinting")
            pl.runCommandAsync(`effect @s slowness 1 1 true`)
            if (pl.isJumping) {
                pl.setRotation({ x: 0, y: 0 })
                applyDash(pl, 0, 1, pl)
                pl.setRotation({ x: var_x, y: var_y })
            }
        } else {
            pl.runCommandAsync(`effect @s slowness 0 1 true`)
            pl.removeTag("sprinting")
        }
        // entity.getEntitiesFromViewDirection().find(plr => plr.entity.name === pl.name).entity.runCommandAsync(`say I saw you uwu`)
    })
})
/** x_________________________________________________x */