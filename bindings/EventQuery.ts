// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { EventLevel } from "./EventLevel";
import type { EventType } from "./EventType";
import type { InstanceEventKind } from "./InstanceEventKind";
import type { InstanceUuid } from "./InstanceUuid";
import type { UserEventKind } from "./UserEventKind";

export interface EventQuery { event_levels: Array<EventLevel> | null, event_types: Array<EventType> | null, instance_event_types: Array<InstanceEventKind> | null, user_event_types: Array<UserEventKind> | null, event_instance_ids: Array<InstanceUuid> | null, bearer_token: string | null, }