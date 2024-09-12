import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Option "mo:base/Option";

actor {
  type Tweet = {
    id: Nat;
    author: Principal;
    content: Text;
    timestamp: Time.Time;
    likes: Nat;
    retweets: Nat;
    comments: Nat;
  };

  type Profile = {
    username: Text;
    bio: Text;
    followersCount: Nat;
    followingCount: Nat;
  };

  private stable var nextTweetId: Nat = 0;
  private var tweets = HashMap.HashMap<Nat, Tweet>(0, Nat.equal, Nat.hash);
  private var profiles = HashMap.HashMap<Principal, Profile>(0, Principal.equal, Principal.hash);

  public shared(msg) func createProfile(username: Text, bio: Text) : async Bool {
    let caller = msg.caller;
    switch (profiles.get(caller)) {
      case (?_) { false };
      case null {
        let newProfile: Profile = {
          username = username;
          bio = bio;
          followersCount = 0;
          followingCount = 0;
        };
        profiles.put(caller, newProfile);
        true
      };
    }
  };

  public query func getProfile(user: Principal) : async ?Profile {
    profiles.get(user)
  };

  public shared(msg) func updateProfile(username: Text, bio: Text) : async Bool {
    let caller = msg.caller;
    switch (profiles.get(caller)) {
      case (?profile) {
        let updatedProfile: Profile = {
          username = username;
          bio = bio;
          followersCount = profile.followersCount;
          followingCount = profile.followingCount;
        };
        profiles.put(caller, updatedProfile);
        true
      };
      case null { false };
    }
  };

  public shared(msg) func createTweet(content: Text) : async Nat {
    let caller = msg.caller;
    switch (profiles.get(caller)) {
      case (?_) {
        let id = nextTweetId;
        nextTweetId += 1;
        let newTweet: Tweet = {
          id = id;
          author = caller;
          content = content;
          timestamp = Time.now();
          likes = 0;
          retweets = 0;
          comments = 0;
        };
        tweets.put(id, newTweet);
        id
      };
      case null {
        // User doesn't have a profile, can't tweet
        assert(false);
        0
      };
    }
  };

  public query func getTweets() : async [Tweet] {
    Array.tabulate<Tweet>(tweets.size(), func (i: Nat) : Tweet {
      switch (tweets.get(i)) {
        case (?tweet) { tweet };
        case null {
          {
            id = 0;
            author = Principal.fromText("2vxsx-fae");
            content = "";
            timestamp = 0;
            likes = 0;
            retweets = 0;
            comments = 0;
          }
        };
      }
    })
  };

  public shared(msg) func likeTweet(id: Nat) : async Bool {
    switch (tweets.get(id)) {
      case (?tweet) {
        let updatedTweet: Tweet = {
          id = tweet.id;
          author = tweet.author;
          content = tweet.content;
          timestamp = tweet.timestamp;
          likes = tweet.likes + 1;
          retweets = tweet.retweets;
          comments = tweet.comments;
        };
        tweets.put(id, updatedTweet);
        true
      };
      case null { false };
    }
  };

  public shared(msg) func retweet(id: Nat) : async Bool {
    switch (tweets.get(id)) {
      case (?tweet) {
        let updatedTweet: Tweet = {
          id = tweet.id;
          author = tweet.author;
          content = tweet.content;
          timestamp = tweet.timestamp;
          likes = tweet.likes;
          retweets = tweet.retweets + 1;
          comments = tweet.comments;
        };
        tweets.put(id, updatedTweet);
        true
      };
      case null { false };
    }
  };

  public shared(msg) func comment(id: Nat) : async Bool {
    switch (tweets.get(id)) {
      case (?tweet) {
        let updatedTweet: Tweet = {
          id = tweet.id;
          author = tweet.author;
          content = tweet.content;
          timestamp = tweet.timestamp;
          likes = tweet.likes;
          retweets = tweet.retweets;
          comments = tweet.comments + 1;
        };
        tweets.put(id, updatedTweet);
        true
      };
      case null { false };
    }
  };
}