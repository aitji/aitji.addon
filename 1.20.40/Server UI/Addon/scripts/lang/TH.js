import { world, scoreboardIdentity, system } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
/** ------------------- */
/** Settings Here */
let money_scoreboard = "money"; /** ชื่อ สกอบอร์ด ของ เงิน */
let bank_scoreboard = "bank"; /** ชื่อ สกอบอร์ด ของ เงินในธนาคาร */

let movestep = 10; /** ใส่ก้าวในการเลื่อนจำนวนเช่น หากใส่ 10 จะเป็น 0 10 20 30 40.. | ใส่ 5 ก็จะเป็น 0 5 10 15 20 25.. */
/** ------------------- */
function getScore(objective, target, useZero = true) {
	try {
		const obj = world.scoreboard.getObjective(objective)
		if (typeof target == 'string') {
			return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
		}
		return obj.getScore(target.scoreboardIdentity)
	} catch {
		return useZero ? 0 : NaN
	}
}
/** ------------------- */
try {
	world.beforeEvents.itemUse.subscribe((data) => {
		let pl = data.source
		let item = data.itemStack

		if (item.id === "minecraft:clock" && pl.hasTag("th")) {
			menu(pl)
		}
	})
} catch (e) {
}
/** ------------------- */
function menu(pl) {
	system.run(() => {
		let form = new ActionFormData();
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
		form.body(`§fสวัสดี! §c${pl.name}§f, ยินดีต้อนรับสู่ เมนูของ เซิปเวอร์นี้\n§fมา§cดู§f กันดีกว่าว่า§cคุณ§fจะทำอะไร?`);
		form.button(`§8ล็อบบี้`);
		form.button(`§8ธนาคาร`);
		form.button(`§8รายละเอียดผู้เล่น`);
		form.button(`§8ภาษา`);
		form.show(pl).then((res) => {
			if (res.selection === 0) {
				/** ใส่ xyz ของ พิกัศ Lobby ที่นี่  */
				pl.runCommandAsync(`tp @s 0 -60 0`)
			}
			if (res.selection === 1) {
				bank(pl)
			}
			if (res.selection === 2) {
				details(pl)
			}
			if (res.selection === 3) {
				lang(pl)
			}
		});
	})
}
/** ------------------- */
/** อย่าแก้ไขถ้าคุณไม่รู้ว่าคุณกำลังทำอะไรอยู่ */
function details(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		let players = [...world.getPlayers()];
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
		form.body(`§fผู้เล่นออนไลน์ ทั้งหมด:§a ${players.length} \n§fรายชื่อผู้เล่นที่อยู่ในเซิปเวอร์ทั้งหมด..`);
		players.map(function (player) {
			let randoms = Math.floor(Math.random() * 2);
			if (randoms == 0) {
				form.button(`${player.name}`, "textures/ui/icon_alex");
			}
			if (randoms == 1) {
				form.button(`${player.name}`, "textures/ui/icon_steve");
			}
		});
		form.show(pl).then((res) => {
			if (res.isCanceled)
				return;
			return menu(pl)
		});
	})
}
/** ------------------- */
function bank(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
		form.body(`§fยินดีต้อนรับ §c${pl.name}§f สู่ §eเมนู ธนาคาร §fคุณต้องการทำธุรกรรมอะไร`);
		form.button(`ย้อนกลับ`);
		form.button(`§8ถอนเงิน`);
		form.button(`§8ฝากเงิน`);
		form.show(pl).then((res) => {
			if (res.selection === 0) {
				return menu(pl)
			}
			if (res.selection === 1) {
				withdraw(pl)
			}
			if (res.selection === 2) {
				deposit(pl)
			}
		})
	})
}

/** ------------------- */

function withdraw(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} 0`)
		let money = getScore('money', pl, true)
		let bank = getScore('bank', pl, true)
		if (bank === 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(`§7> §fขอโทษด้วยคุณไม่มี เงินใน§cบัชชีธนาคาร§fเลย.. §7<`)
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
			form.slider(`§fสวัสดี! §c${pl.name}§f เลื่อนเพื่อถอน§aเงิน§fเข้า §6กระเป๋า§fตังของคุณ §fกำลังเลื่อนอยู่ที่ `, 0, bank, movestep)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${bank_scoreboard} ${res.formValues[0]}`)
				pl.sendMessage(`§7> §fคุณได้ §aถอนเงิน §fจำนวน §c${res.formValues[0]} §7<`)
			})
		}
	})
}

/** ------------------- */

function deposit(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} 0`)
		let money = getScore('money', pl, true)
		let bank = getScore('bank', pl, true)
		if (money === 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(`§7> §fขอโทษด้วยคุณ§cไม่มี§fเงินเลยสักบาทเดียว §7<`)
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
			form.slider(`§fสวัสดี ${pl.name} §fเลื่อนเพื่อฝากเงินเข้า §eธนาคาร §fกำลังเลื่อนอยู่ที่ `, 0, money, movestep)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${money_scoreboard} ${res.formValues[0]}`)
				pl.sendMessage(`§7> §fคุณได้ทำการ §cฝากเงิน §fจำนวน §c${res.formValues[0]} §7<`)
			})
		}
	})
}

/** ------------------- */

function lang(pl) {
	pl.sendMessage(`§7> §fPlease OPEN §cMENU §fAgin.. §7<`)
	pl.runCommandAsync(`tag @s remove th`)
}