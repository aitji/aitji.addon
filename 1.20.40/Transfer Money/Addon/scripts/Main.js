/** ---------- OvO ---------- */
import { system, world } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
import "./Clock"
/** ---------- OvO ---------- */