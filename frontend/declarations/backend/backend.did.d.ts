import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Tab {
  'id' : bigint,
  'content' : string,
  'tabType' : string,
  'size' : [bigint, bigint],
  'timestamp' : Time,
  'position' : [bigint, bigint],
  'attachedTo' : [] | [bigint],
}
export type Time = bigint;
export interface _SERVICE {
  'createTab' : ActorMethod<
    [string, string, [bigint, bigint], [bigint, bigint], [] | [bigint]],
    bigint
  >,
  'deleteDocument' : ActorMethod<[bigint], boolean>,
  'deleteTab' : ActorMethod<[bigint], boolean>,
  'getDocumentContent' : ActorMethod<[bigint], [] | [Uint8Array | number[]]>,
  'getDocuments' : ActorMethod<
    [],
    Array<[bigint, string, string, [bigint, bigint], [bigint, bigint]]>
  >,
  'getTabs' : ActorMethod<[], Array<Tab>>,
  'updateDocumentPosition' : ActorMethod<[bigint, [bigint, bigint]], boolean>,
  'updateDocumentSize' : ActorMethod<[bigint, [bigint, bigint]], boolean>,
  'updateTabContent' : ActorMethod<[bigint, string], boolean>,
  'updateTabPosition' : ActorMethod<[bigint, [bigint, bigint]], boolean>,
  'updateTabSize' : ActorMethod<[bigint, [bigint, bigint]], boolean>,
  'uploadDocument' : ActorMethod<
    [string, string, Uint8Array | number[], [bigint, bigint], [bigint, bigint]],
    bigint
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
