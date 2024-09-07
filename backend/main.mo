import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Tab = {
    id : Nat;
    tabType : Text;
    content : Text;
    timestamp : Time.Time;
    position : (Nat, Nat);
    size : (Nat, Nat);
  };

  stable var nextTabId : Nat = 0;
  let tabs = HashMap.HashMap<Nat, Tab>(10, Nat.equal, Nat.hash);

  public func createTab(tabType : Text, content : Text, position : (Nat, Nat), size : (Nat, Nat)) : async Nat {
    let id = nextTabId;
    nextTabId += 1;
    let newTab : Tab = {
      id = id;
      tabType = tabType;
      content = content;
      timestamp = Time.now();
      position = position;
      size = size;
    };
    tabs.put(id, newTab);
    id
  };

  public func updateTabContent(id : Nat, content : Text) : async Bool {
    switch (tabs.get(id)) {
      case (null) { false };
      case (?tab) {
        let updatedTab : Tab = {
          id = tab.id;
          tabType = tab.tabType;
          content = content;
          timestamp = Time.now();
          position = tab.position;
          size = tab.size;
        };
        tabs.put(id, updatedTab);
        true
      };
    }
  };

  public func updateTabPosition(id : Nat, position : (Nat, Nat)) : async Bool {
    switch (tabs.get(id)) {
      case (null) { false };
      case (?tab) {
        let updatedTab : Tab = {
          id = tab.id;
          tabType = tab.tabType;
          content = tab.content;
          timestamp = Time.now();
          position = position;
          size = tab.size;
        };
        tabs.put(id, updatedTab);
        true
      };
    }
  };

  public func updateTabSize(id : Nat, size : (Nat, Nat)) : async Bool {
    switch (tabs.get(id)) {
      case (null) { false };
      case (?tab) {
        let updatedTab : Tab = {
          id = tab.id;
          tabType = tab.tabType;
          content = tab.content;
          timestamp = Time.now();
          position = tab.position;
          size = size;
        };
        tabs.put(id, updatedTab);
        true
      };
    }
  };

  public func deleteTab(id : Nat) : async Bool {
    switch (tabs.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getTabs() : async [Tab] {
    Array.map<(Nat, Tab), Tab>(Iter.toArray(tabs.entries()), func (entry) { entry.1 })
  };
}
