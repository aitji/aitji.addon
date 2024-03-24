import { Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

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

function getText(player, get) {
	let go
	if (player.hasTag("eng")) {
		if (get === "title") go = `§e»§c ${player.name}'s §fInterface §e«§r`
		if (get === "welcomeBody") go = `§fHi! §c${player.name}§f, Welcome to Server Menu\nLet §csee§f what do you want?§r`
		if (get === "b1") go = `§8Lobby/Hub`
		if (get === "b2") go = `§8Bank`
		if (get === "b3") go = `§8Player Details`
		if (get === "b4") go = `§8Langues`

		if (get === "bankBody") go = `§fWelcome §c${pl.name}§f to §eBANK §fMenu What do you want to do?`
	} else if (player.hasTag("th")) {
		if (get === "title") go = `§e» §fเมนูของ §c${player.name}'s  §e«§r`
		if (get === "welcomeBody") go = `§fสวัสดี! §c${player.name}§f, ยินดีต้อนรับสู่ เมนูของ เซิปเวอร์นี้\n§fมา§cดู§f กันดีกว่าว่า§cคุณ§fจะทำอะไร!§r`
		if (get === "b1") go = `§8ล็อบบี้`
		if (get === "b2") go = `§8ธนาคาร`
		if (get === "b3") go = `§8รายละเอียดผู้เล่น`
		if (get === "b4") go = `§8ภาษา`

		if (get === "bankBody") go = `§fยินดีต้อนรับ §c${pl.name}§f สู่ §eเมนู ธนาคาร §fคุณต้องการทำธุรกรรมอะไร?`
	} else {
		return `§4player tag wasn't found\nerror contact: §cDiscord.gg/z4Mu55phPw`
	}
	return go
}

function menu(player) {
	system.run(() => {
		let form = new ActionFormData()
		form.title(getText(player, 'title'))
		form.body(getText(player, 'welcomeBody'))
		form.button(getText(player, 'b1'))
		form.button(getText(player, 'b2'))
		form.button(getText(player, 'b3'))
		form.button(getText(player, 'b4'))
		form.show(player).then((res) => {
			if (res.selection === 0) player.runCommandAsync(`tp @s 0 -60 0`)
			if (res.selection === 1) bank(player)
			if (res.selection === 2) details(player)
			if (res.selection === 3) handel(player, true)
		})
	})
}

function details(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		let players = [...world.getAllPlayers()];
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
		form.body(`Player Online: ${players.length} \nAll §cPlayer§f In This Server..`);
		form.button(`Go Back`)
		players.map(function (player) {
			let textures = ['alex', 'steve']
			form.button(`${player.name}`, `textures/ui/${textures[Math.floor(Math.random() * 2)]}`)
		})
		form.show(pl).then((res) => {
			if (res.isCanceled) return;
			return menu(pl)
		});
	})
}

function bank(pl) {
	system.run(() => {
		pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
		let form = new ActionFormData();
		form.title(getText(pl, 'title'));
		form.body(``);
		form.button(`Back`);
		form.button(`§8Withdraw Money`);
		form.button(`§8Deposit Money`);
		form.show(pl).then((res) => {
			if (res.selection === 0) return menu(pl)
			if (res.selection === 1) withdraw(pl)
			if (res.selection === 2) deposit(pl)
		})
	})
}

function withdraw(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} 0`)
		let money = getScore('money', pl, true)
		let bank = getScore('bank', pl, true)
		if (bank === 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(`§7> §fSorry You didn't have §cmoney§f in Bank §7<`)
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
			form.slider(`§fHi §c${pl.name}§f Slider You §aMoney§f in bank back to you §6Pocket §fScrolling `, 0, bank, movestep)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${bank_scoreboard} ${res.formValues[0]}`)
				pl.sendMessage(`§7> §fYou has been §aWithdraw §fYou Money for §c${res.formValues[0]} §7<`)
			})
		}
	})
}

function deposit(pl) {
	system.run(() => {
		pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} 0`)
		pl.runCommandAsync(`scoreboard players add @s ${money_scoreboard} 0`)
		let money = getScore('money', pl, true)
		let bank = getScore('bank', pl, true)
		if (money === 0) {
			pl.runCommandAsync(`playsound random.break @s ~~~ 50`);
			pl.sendMessage(`§7> §fSorry You didn't have any §cmoney§f §7<`)
		} else {
			pl.runCommandAsync(`playsound random.pop @s ~~~ 50`);
			let form = new ModalFormData();
			form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
			form.slider(`§fHi ${pl.name} Slider You §aMoney§f in you §6Pocket to the §eBank! §fScrolling `, 0, money, movestep)
			form.show(pl).then((res) => {
				pl.runCommandAsync(`scoreboard players add @s ${bank_scoreboard} ${res.formValues[0]}`)
				pl.runCommandAsync(`scoreboard players remove @s ${money_scoreboard} ${res.formValues[0]}`)
				pl.sendMessage(`§7> §fYou has been §cDeposit §fYou Money for §c${res.formValues[0]} §7<`)
			})
		}
	})
}

function handel(pl, force = false) {
	system.run(() => {
		if (force) bet(pl)
		else if (pl.hasTag('th') || pl.hasTag('eng')) menu(pl)
		else bet(pl)
	})
}

function bet(pl) {
	let form = new ActionFormData()
	form.title(`§e»§c ${pl.name}'s §fInterface §e«§r`)
	form.body(`§l§fplease pick up your §alang§f!\n§l§fกรุณาเลือก §aภาษา §fของคุณ!§r`)
	form.button(`§l§8English§r`);
	form.button(`§l§8ภาษาไทย§r`);
	form.show(pl).then((res) => {
		pl.runCommandAsync(`tag @s remove th`)
		pl.runCommandAsync(`tag @s remove eng`)
		if (res.selection === 0) {
			pl.sendMessage(`§7> §fLangues: §aEnglish §7<`)
			pl.runCommandAsync(`tag @s add eng`)
		}
		if (res.selection === 1) {
			pl.sendMessage(`§7> §fภาษา: §aไทย §7<`)
			pl.runCommandAsync(`tag @s add th`)
		}
		system.runTimeout(() => handel(pl), 5)
	})
}

world.beforeEvents.itemUse.subscribe((data) => {
	let pl = data.source
	let item = data.itemStack

	if (item.typeId === "minecraft:clock") handel(pl)
})
