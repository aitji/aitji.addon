import "./server/item"
import "./officer/attack"
import "./bandit/steal"
import { system } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe(data => data.cancel = true)
/** ------------------------------------------- */
/**
 * @author InwAitJi
 * @description This Script was created by InwAitJi
 * @copyright 2023-2024 InwAitJi
 * @youtube https://www.youtube.com/@InwAitJi/
 */
/** ------------------------------------------- */