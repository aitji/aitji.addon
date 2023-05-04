/** ------------------------------------- */
import { system, world } from "@minecraft/server";
system.events.beforeWatchdogTerminate.subscribe(data => data.cancel = true)
import "./Video/AntiSpam"
/** ------------------------------------- */