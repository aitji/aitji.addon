import { world } from "@minecraft/server"
import { getStyle } from "../function";

let prefix = ':'
class custom {
    constructor(keyword, command = [], description) {
        this.k = prefix + keyword;
        this.keyword = keyword;
        this.c = command;
        this.d = `§7${description}§r`;
    }
}

let server_cmd = [
    new custom('hub', ['tp @s 0 -60 0'], 'Hub!'),
    new custom('lobby', ['tp @s 0 -60 0'], 'Lobby!'),
    new custom('end', ['tp @s 0 -63 -307'], 'End!'),
    new custom('fin', ['tp @s 0 -63 -307'], 'End!'),
    new custom('cmd', ['tp @s 6 -60 -334'], 'Command!'),
]

world.beforeEvents.chatSend.subscribe(data => {
    const player = data.sender
    const msg = data.message
    data.cancel = true;
    if (msg.startsWith(":leave")) {
        const plr = player.name
        const en = Array.from(world.getDimension("overworld").getEntities()).find(en => en.typeId.includes("strider") && en.nameTag.split("'s")[0].includes(plr))
        if (en) {
            world.getDimension('overworld').runCommandAsync(`scoreboard players set "${plr}§r" strider 1`)
            en.runCommandAsync(`tp @s ~~-100~`)
            en.addTag("system:kill")
            en.runCommandAsync(`kill @s`)
        }
        return
    }
    if (msg.startsWith(prefix)) {
        let found = false;
        if (player.hasTag("Admin")) {
            for (const cmd of server_cmd) {
                if (msg.startsWith(cmd.k)) {
                    found = true;
                    player.runCommandAsync(cmd.c.join(' '));
                    player.sendMessage(`§8[§7${cmd.d}§8]§r`);
                }
            }
        }
        if (!found) player.sendMessage(`§cUnknown command: ${msg.substring(1).split(" ")[0]}. Please check that the command exists and that you have permission to use it.`);
        return
    }
    world.sendMessage(`§ฟ§l${getStyle(player)}${player.name}§r§l§f ${msg}`)
})