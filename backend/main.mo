import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Option "mo:base/Option";

actor {
  type Tab = {
    id : Nat;
    tabType : Text;
    content : Text;
    timestamp : Time.Time;
    position : (Nat, Nat);
    size : (Nat, Nat);
    attachedTo : ?Nat;
  };

  type Document = {
    id : Nat;
    fileName : Text;
    fileType : Text;
    content : Blob;
    timestamp : Time.Time;
    position : (Nat, Nat);
    size : (Nat, Nat);
  };

  stable var nextTabId : Nat = 0;
  stable var nextDocId : Nat = 0;
  let tabs = HashMap.HashMap<Nat, Tab>(10, Nat.equal, Nat.hash);
  let documents = HashMap.HashMap<Nat, Document>(10, Nat.equal, Nat.hash);

  public func createTab(tabType : Text, content : Text, position : (Nat, Nat), size : (Nat, Nat), attachedTo : ?Nat) : async Nat {
    let id = nextTabId;
    nextTabId += 1;
    let newTab : Tab = {
      id = id;
      tabType = tabType;
      content = content;
      timestamp = Time.now();
      position = position;
      size = size;
      attachedTo = attachedTo;
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
          attachedTo = tab.attachedTo;
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
          attachedTo = tab.attachedTo;
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
          attachedTo = tab.attachedTo;
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

  public func uploadDocument(fileName : Text, fileType : Text, content : Blob, position : (Nat, Nat), size : (Nat, Nat)) : async Nat {
    let id = nextDocId;
    nextDocId += 1;
    let newDoc : Document = {
      id = id;
      fileName = fileName;
      fileType = fileType;
      content = content;
      timestamp = Time.now();
      position = position;
      size = size;
    };
    documents.put(id, newDoc);
    id
  };

  public func updateDocumentPosition(id : Nat, position : (Nat, Nat)) : async Bool {
    switch (documents.get(id)) {
      case (null) { false };
      case (?doc) {
        let updatedDoc : Document = {
          id = doc.id;
          fileName = doc.fileName;
          fileType = doc.fileType;
          content = doc.content;
          timestamp = Time.now();
          position = position;
          size = doc.size;
        };
        documents.put(id, updatedDoc);
        true
      };
    }
  };

  public func updateDocumentSize(id : Nat, size : (Nat, Nat)) : async Bool {
    switch (documents.get(id)) {
      case (null) { false };
      case (?doc) {
        let updatedDoc : Document = {
          id = doc.id;
          fileName = doc.fileName;
          fileType = doc.fileType;
          content = doc.content;
          timestamp = Time.now();
          position = doc.position;
          size = size;
        };
        documents.put(id, updatedDoc);
        true
      };
    }
  };

  public func deleteDocument(id : Nat) : async Bool {
    switch (documents.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getDocuments() : async [(Nat, Text, Text, (Nat, Nat), (Nat, Nat))] {
    Array.map<(Nat, Document), (Nat, Text, Text, (Nat, Nat), (Nat, Nat))>
      (Iter.toArray(documents.entries()), func (entry) {
        (entry.1.id, entry.1.fileName, entry.1.fileType, entry.1.position, entry.1.size)
      })
  };

  public func getDocumentContent(id : Nat) : async ?Blob {
    switch (documents.get(id)) {
      case (null) { null };
      case (?doc) { ?doc.content };
    }
  };
}
