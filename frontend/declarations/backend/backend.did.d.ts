import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Tab {
  'id' : bigint,
  'content' : string,
  'tabType' : string,
  'timestamp' : Time,
}
export type Time = bigint;
export interface _SERVICE {
  'createTab' : ActorMethod<[string, [] | [string]], bigint>,
  'deleteTab' : ActorMethod<[bigint], boolean>,
  'getTabs' : ActorMethod<[], Array<Tab>>,
  'updateTabContent' : ActorMethod<[bigint, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
