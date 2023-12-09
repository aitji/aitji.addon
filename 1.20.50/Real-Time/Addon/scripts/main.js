/** ------------------------------------- */
/** Setup Project.. */
import { system, world } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
import "./Video/time"
/** ------------------------------------- */