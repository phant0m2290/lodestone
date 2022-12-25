// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { InstanceUuid } from "./InstanceUuid";
import type { UserId } from "./UserId";

export type CausedBy = { type: "User", user_id: UserId, user_name: string, } | { type: "Instance", instance_uuid: InstanceUuid, } | { type: "Macro", macro_pid: number, } | { type: "System" } | { type: "Unknown" };