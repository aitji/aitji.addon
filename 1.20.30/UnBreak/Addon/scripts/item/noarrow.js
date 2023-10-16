import { world } from "@minecraft/server";
world.afterEvents.projectileHitBlock.subscribe(data => data.projectile.runCommandAsync(`kill @s`))