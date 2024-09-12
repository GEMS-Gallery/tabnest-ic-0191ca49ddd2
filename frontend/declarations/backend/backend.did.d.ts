import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Profile {
  'bio' : string,
  'username' : string,
  'followersCount' : bigint,
  'followingCount' : bigint,
}
export type Time = bigint;
export interface Tweet {
  'id' : bigint,
  'retweets' : bigint,
  'content' : string,
  'author' : Principal,
  'likes' : bigint,
  'timestamp' : Time,
  'comments' : bigint,
}
export interface _SERVICE {
  'comment' : ActorMethod<[bigint], boolean>,
  'createProfile' : ActorMethod<[string, string], boolean>,
  'createTweet' : ActorMethod<[string], bigint>,
  'getProfile' : ActorMethod<[Principal], [] | [Profile]>,
  'getTweets' : ActorMethod<[], Array<Tweet>>,
  'likeTweet' : ActorMethod<[bigint], boolean>,
  'retweet' : ActorMethod<[bigint], boolean>,
  'updateProfile' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
