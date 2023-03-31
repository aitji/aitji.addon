import { world } from "mojang-minecraft";
import { ActionFormData } from "mojang-minecraft-ui";
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
	world.getDimension('overworld').runCommand(`tell @s §4Error:§f ${e}`)
}

function lang(pl)	{
	let form = new ActionFormData();
	form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
	form.body(`§l§fPlease selction §alang§f First\n§l§fกรุณาเลือก §aภาษา §fก่อน`)
	form.button(`§8English`);
	form.button(`§l§8ภาษาไทย`);
	form.show(pl).then((res) => {
		if(res.selection === 0){
			pl.tell(`§7> §fPlease OPEN §cMENU §fAgin.. §7<`)
			pl.runCommand(`tag @s add eng`)
		}
		if(res.selection === 1){ 
			pl.tell(`§7> §fกรุณาเปิด §cเมนู§f ใหม่อีกครั้ง.. §7<`)
			pl.runCommand(`tag @s add th`)
		}
	})
}