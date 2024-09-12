export const idlFactory = ({ IDL }) => {
  const Profile = IDL.Record({
    'bio' : IDL.Text,
    'username' : IDL.Text,
    'followersCount' : IDL.Nat,
    'followingCount' : IDL.Nat,
  });
  const Time = IDL.Int;
  const Tweet = IDL.Record({
    'id' : IDL.Nat,
    'retweets' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Principal,
    'likes' : IDL.Nat,
    'timestamp' : Time,
    'comments' : IDL.Nat,
  });
  return IDL.Service({
    'comment' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'createProfile' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'createTweet' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'getProfile' : IDL.Func([IDL.Principal], [IDL.Opt(Profile)], ['query']),
    'getTweets' : IDL.Func([], [IDL.Vec(Tweet)], ['query']),
    'likeTweet' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'retweet' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateProfile' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
