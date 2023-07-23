import { system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
import "./lang/ENG"
import "./lang/TH"
/** ---------------------------- */
try {
	world.events.beforeItemUse.subscribe((data) => {
		let pl = data.source
		let item = data.item

		if (item.id === "minecraft:clock" && !pl.hasTag("eng") && !pl.hasTag("th")) {
			lang(pl)
		}
	})
} catch (e) {
}

function lang(pl)	{
	let form = new ActionFormData();
	form.title(`§e»§c ${pl.name}'s §fInterface §e«§r`)
	form.body(`§l§fPlease selction §alang§f First\n§l§fกรุณาเลือก §aภาษา §fก่อน§r`)
	form.button(`§l§8English§r`);
	form.button(`§l§8ภาษาไทย§r`);
	form.show(pl).then((res) => {
		if(res.selection === 0){
			pl.sendMessage(`§7> §fPlease OPEN §cMENU §fAgin.. §7<`)
			pl.runCommandAsync(`tag @s add eng`)
		}
		if(res.selection === 1){ 
			pl.sendMessage(`§7> §fกรุณาเปิด §cเมนู§f ใหม่อีกครั้ง.. §7<`)
			pl.runCommandAsync(`tag @s add th`)
		}
	})
}