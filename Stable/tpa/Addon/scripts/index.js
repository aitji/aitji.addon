import { world, system, Player } from "@minecraft/server"
import { ModalFormData, ActionFormData, MessageFormData } from "@minecraft/server-ui"

const TPA_DATA_KEY = "tpa_data"
const singlePlayer = false
const TPA_COOLDOWN = 30000 // 30 sec
const EXPIRE_TIME = 90000 // 90 sec

const icon = ['character_creator', 'emotes']
const setTPAData = (data) => world.setDynamicProperty(TPA_DATA_KEY, JSON.stringify(data))
/** @returns {number} */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
/** @returns {string} */
function getTPAData() {
    const dataStr = world.getDynamicProperty(TPA_DATA_KEY) || ''
    return dataStr ? JSON.parse(dataStr) : {}
}
/** @returns {Boolean} */
const canBeAsk = (pl) => {
    const currentTime = Date.now()
    const time = pl.getDynamicProperty('tpa_cooldown') || 0
    return !time || currentTime - time >= TPA_COOLDOWN
}

world.beforeEvents.itemUse.subscribe((aitji) => {
    const { source, itemStack } = aitji
    if (itemStack.typeId === "minecraft:compass") system.run(() => mainTPA(source))
})

world.afterEvents.playerLeave.subscribe((event) => {
    const playerName = event.playerName
    const tpaData = getTPAData()
    const players = world.getAllPlayers()
    let updated = false

    if (tpaData[playerName]) {
        delete tpaData[playerName]
        updated = true
    }

    for (const [otherPlayerName, playerData] of Object.entries(tpaData)) {
        playerData.asking = playerData.asking.filter(ask => {
            if (ask.to === playerName) {
                const player = players.find(p => p.name === otherPlayerName)
                if (player) player.sendMessage(`§cYour teleport request to ${playerName} was cancelled because they left the game.`)
                return false
            }
            return true
        })

        playerData.pending = playerData.pending.filter(pend => {
            if (pend.from === playerName) {
                const player = players.find(p => p.name === otherPlayerName)
                if (player) player.sendMessage(`§cA teleport request from ${playerName} was cancelled because they left the game.`)
                return false
            }
            return true
        })

        if (playerData.asking.length === 0 && playerData.pending.length === 0) delete tpaData[otherPlayerName]
        updated = true
    }

    if (updated) setTPAData(tpaData)
})

/**@param {Player} pl*/
export function mainTPA(pl) {
    const form = new ActionFormData()
    const tpaData = getTPAData()
    const playerData = tpaData[pl.name] || { asking: [], pending: [] }

    const pCount = playerData.pending.length
    const aCount = playerData.asking.length

    const pOut = pCount > 0 ? `§e${pCount} Pending§8` : `§n${pCount} Pending§r`
    const aOut = aCount > 0 ? `§d${aCount} Asking§8` : `§u${aCount} Asking§r`

    form.title(`§lT§rele§lP§rortation §lA§rsking§r`)
    form.body(`§l${pl.name}'s Teleport Ask§r\n§7| §r§uAsking§f is you're asking other player\n§7| §nPending§f is someone is asking`)
    form.button(`Ask for Teleportation`)
    form.button(`Your Teleportation\n§n${pOut}§f | §u${aOut}§r`)
    form.show(pl).then(({ selection: sel }) => {
        if (sel === 0) ask(pl)
        if (sel === 1) pending(pl)
    })
}

/**@param {Player} pl*/
function pending(pl) {
    const form = new ActionFormData()
    const tpaData = getTPAData()
    const plData = tpaData[pl.name] || { asking: [], pending: [] }

    const pCount = plData.pending.length
    const aCount = plData.asking.length

    const pOut = pCount > 0 ? `§e${pCount} Pending§8` : `§n${pCount} Pending§r`
    const aOut = aCount > 0 ? `§d${aCount} Asking§8` : `§u${aCount} Asking§r`

    form.title(`Pending Box!`)
    form.body(`§7| §fYou're now currently have\n§7| §n${pOut}\n§7| §u${aOut}\n\n§7| §fYou shall manage your\n§7| §nPending§f/§uAsking§f here!`)
    form.button(`Manage Asking`)
    plData.pending.forEach(data => form.button(`${data.from}\n${data.style === 0 ? `them to you!` : `you to them`}: §8${data.reason || 'Not Reason Specify'}`, `textures/ui/sidebar_icons/${icon[random(0, icon.length - 1)]}`))
    form.show(pl).then(res => {
        if (res.canceled) return
        const resu = res.selection - 1
        if (resu === -1) return manage(pl)
        else {
            const data = plData.pending[resu]
            if (!data) return pl.sendMessage(`§cThis request has expired or been removed.`)

            const plr = world.getAllPlayers().find(plr => plr.name === data.from)
            if (plr) {
                const confirm = new MessageFormData()
                confirm.title(`Teleport Confirm`)
                confirm.body(`Do you want to ${data.style === 0 ? `teleport ${data.from} to you` : `teleport to ${data.from}`}?\nReason: ${data.reason || "Not Reason Specify"}\nStyle: ${data.style === 0 ? `them to you!` : `you to them`}:`)
                confirm.button2(`Yes, I'd like to!`)
                confirm.button1(`§l§mDeny§r It`)
                confirm.show(pl).then((res) => {
                    if (res.selection === 1) {
                        const tpaData = getTPAData()
                        const plDat = tpaData[pl.name]
                        const fromPlDat = tpaData[data.from]

                        if (data.style === 0) {
                            plr.teleport(pl.location, { dimension: pl.dimension })
                            plr.sendMessage(`§fYou just teleported to §a${pl.name}`)
                            pl.sendMessage(`§a${plr.name} §fjust teleported to you!`)
                        } else {
                            pl.teleport(plr.location, { dimension: plr.dimension })
                            pl.sendMessage(`§fYou just teleported to §a${plr.name}`)
                            plr.sendMessage(`§a${pl.name} §fjust teleported to you!`)
                        }

                        plDat.pending = plDat.pending.filter(p => p.from !== data.from)
                        fromPlDat.asking = fromPlDat.asking.filter(a => a.to !== pl.name)

                        setTPAData(tpaData)

                        pl.playSound('random.orb', { volume: 0.45, pitch: 0.5 })
                        plr.playSound('random.orb', { volume: 0.45, pitch: 0.5 })
                    }
                    if (res.selection === 0) {
                        const tpaData = getTPAData()
                        const plDat = tpaData[pl.name]
                        const fromPlDat = tpaData[data.from]

                        plDat.pending = plDat.pending.filter(p => p.from !== data.from)
                        fromPlDat.asking = fromPlDat.asking.filter(a => a.to !== pl.name)

                        setTPAData(tpaData)

                        plr.sendMessage(`§cYour Teleport request to ${pl.name} was denied!`)
                        pl.sendMessage(`§cYou just canceled Teleport request from ${data.from}`)
                        pl.playSound('random.break', { volume: 0.45, pitch: 0.5 })
                    }
                })
            } else {
                pl.sendMessage(`§cThis player just went offline! The request will be removed.`)
                pl.playSound('random.break', { volume: 0.3, pitch: 0.45 })

                const tpaData = getTPAData()
                const plDat = tpaData[pl.name]
                plDat.pending = plDat.pending.filter(p => p.from !== data.from)
                setTPAData(tpaData)
            }
        }
    })
}

/**@param {Player} pl*/
function manage(pl) {
    const form = new ActionFormData()
    const tpaData = getTPAData()
    const plData = tpaData[pl.name] || { asking: [], pending: [] }

    const pCount = plData.pending.length
    const aCount = plData.asking.length

    const pOut = pCount > 0 ? `§e${pCount} Pending§8` : `§n${pCount} Pending§r`
    const aOut = aCount > 0 ? `§d${aCount} Asking§8` : `§u${aCount} Asking§r`

    form.title(`Asking Box!`)
    form.body(`§7| §fYou're now currently have\n§7| §n${pOut}\n§7| §u${aOut}\n\n§7| §fManage you §uAsking§f Here!`)
    form.button(`Go Back..`)
    plData.asking.forEach(data => form.button(`Asked: ${data.to}\n${data.style === 0 ? `you to them!` : `them to you`} §8${data.reason || 'Not Reason Specify'}`, `textures/ui/sidebar_icons/${icon[random(0, icon.length - 1)]}`))
    form.show(pl).then(res => {
        if (res.canceled) return
        const resu = res.selection - 1
        if (resu <= -1) return pending(pl)
        else {
            const data = plData.asking[resu]
            if (!data) return pl.sendMessage(`§cThis request has expired or been removed.`)

            const confirm = new MessageFormData()
            confirm.title(`Cancel Confirm`)
            confirm.body(`Do you want to cancel asking teleport to ${data.to}?\nReason: ${data.reason || "Not Reason Specify"}\nStyle: ${data.style === 0 ? `you to them!` : `them to you`}`)
            confirm.button2(`Yes, §m§ldeny it!§r`)
            confirm.button1(`No, Go Back`)
            confirm.show(pl).then((res) => {
                if (res.selection === 1) {
                    const tpaData = getTPAData()
                    const plData = tpaData[pl.name]
                    const toPlData = tpaData[data.to]

                    plData.asking = plData.asking.filter(a => a.to !== data.to)
                    if (toPlData) toPlData.pending = toPlData.pending.filter(p => p.from !== pl.name)

                    setTPAData(tpaData)

                    pl.sendMessage(`§fYou just canceled asking teleport to §c${data.to}!`)
                    pl.playSound('random.break', { volume: 0.3, pitch: 0.45 })

                    const plr = world.getAllPlayers().find(p => p.name === data.to)
                    if (plr) plr.sendMessage(`§c${pl.name} canceled their teleport request to you.`)
                }
            })
        }
    })
}

/**@param {Player} pl*/
export function ask(pl) {
    if (!canBeAsk(pl)) return pl.sendMessage(`§cYou need to wait before asking another teleport!`)
    var players = world.getAllPlayers().sort((a, b) => a.name.localeCompare(b.name)).filter(plr => plr.name !== pl.name)
    if (singlePlayer) players = world.getAllPlayers().sort((a, b) => a.name.localeCompare(b.name))
    if (players.length <= 0) {
        pl.sendMessage(`§cNobody online right now TwT`)
        pl.playSound('random.break', { volume: 0.3, pitch: 0.45 })
        return
    }
    const form = new ModalFormData()
    form.title(`§lT§rele§lP§rortation §lA§rsking§r`)
    form.dropdown(`§lWho§r would you like to teleport to? §c*`, players.map(a => a.name), 0)
    form.textField(`Enter a specify reason to convince this player\n§o§7(optional)§r`, `Example: I'm your pie :p`, '')
    form.dropdown(`Choose a teleportation style §c*`, ['you §lteleport to§r target §o(a>b)§r', 'target §lteleport to§r you §o(a<b)§r'], 0)
    form.show(pl).then(res => {
        if (res.canceled) return
        const resu = res.formValues || [0, '', 0]
        const plr = players[resu[0]]
        const reason = resu[1] ? resu[1].replace(/\|/g, ":") : ''

        const tpaData = getTPAData()
        const plData = tpaData[pl.name] || { asking: [], pending: [] }
        const plrData = tpaData[plr.name] || { asking: [], pending: [] }

        if (plData.asking.some(ask => ask.to === plr.name)) {
            pl.sendMessage(`§cYou have already asked to teleport to ${plr.name}!`)
            pl.playSound('random.break', { volume: 0.3, pitch: 0.45 })
        } else {
            if (plr) {
                const request = {
                    from: pl.name,
                    to: plr.name,
                    reason: reason || "Not Reason Specify",
                    style: resu[2],
                    timestamp: Date.now()
                }

                plData.asking.push(request)
                plrData.pending.push(request)

                tpaData[pl.name] = plData
                tpaData[plr.name] = plrData

                setTPAData(tpaData)

                plr.sendMessage(`§a${pl.name} §fis §uasking§r§f to teleport ${resu[2] === 0 ? 'to you' : 'you to them'}, §aAccept§f/§cDeny§f it on your §lcompass!§r\n§rReason: §7${reason || "Not Reason Specify"}`)
                pl.sendMessage(`§fYou're asking to teleport ${resu[2] === 0 ? 'you' : 'them'} to ${resu[2] === 0 ? 'them' : 'you'}. This §npending§r§f will expire in §l60 seconds!\n§rReason: §7${reason || "Not Reason Specify"}`)
                pl.playSound('random.orb', { volume: 0.45, pitch: 0.5 })
                plr.playSound('random.pop', { volume: 0.25, pitch: 0.5 })

                const timestamp = Date.now()
                pl.setDynamicProperty('tpa_cooldown', timestamp)
            } else {
                pl.sendMessage(`§cThis player just went offline! Zzz`)
                pl.playSound('random.break', { volume: 0.3, pitch: 0.45 })
            }
        }
    })
}

system.runInterval(() => {
    const tpaData = getTPAData()
    const currentTime = Date.now()
    const players = world.getAllPlayers()
    let updated = false

    for (const [playerName, playerData] of Object.entries(tpaData)) {
        playerData.asking = playerData.asking.filter(ask => {
            if (currentTime - ask.timestamp > EXPIRE_TIME) {
                const targetData = tpaData[ask.to]
                if (targetData) targetData.pending = targetData.pending.filter(p => p.from !== playerName)
                updated = true

                const player = players.find(p => p.name === playerName)
                if (player) player.sendMessage(`§cYour teleport request to ${ask.to} has expired.`)

                return false
            }
            return true
        })

        playerData.pending = playerData.pending.filter(pend => {
            if (currentTime - pend.timestamp > EXPIRE_TIME) {
                updated = true

                const player = players.find(p => p.name === playerName)
                if (player) player.sendMessage(`§cA teleport request from ${pend.from} has expired.`)

                return false
            }
            return true
        })

        if (playerData.asking.length === 0 && playerData.pending.length === 0) {
            delete tpaData[playerName]
            updated = true
        }
    }

    if (updated) setTPAData(tpaData)
}, 20)
