// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { InstanceInfo } from "./InstanceInfo";
import type { InstanceUuid } from "./InstanceUuid";

export type ProgressionEndValue = { "type": "InstanceCreation" } & InstanceInfo | { "type": "InstanceDelete", instance_uuid: InstanceUuid, } | { "type": "FSOperationCompleted", instance_uuid: InstanceUuid, success: boolean, message: string, };