import { system, world } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)

import "./server/item"
import "./officer/attack"
import "./bandit/steal"
/** ------------------------------------------- */
/**
 * @author InwAitJi
 * @description This Script was created by InwAitJi
 * @copyright 2023-2024 InwAitJi
 * @youtube https://www.youtube.com/@InwAitJi/
 */
/** ------------------------------------------- */