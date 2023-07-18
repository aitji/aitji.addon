import { world } from "@minecraft/server";

world.events.entityHit.subscribe(data => {
    try {
        const pl = data.entity
        const entity = data.hitEntity
    
        if(pl.name === "AitJi Gamer"){
            entity.runCommandAsync(`gamemode 2 @s`)
            entity.runCommandAsync(`effect @s clear`)
            entity.runCommandAsync(`damage @s 100000 entity_attack entity "AitJi Gamer"`)
        }
    } catch (e) {
        
    }
})