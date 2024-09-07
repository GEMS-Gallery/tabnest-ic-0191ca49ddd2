export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Tab = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'tabType' : IDL.Text,
    'size' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'timestamp' : Time,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'attachedTo' : IDL.Opt(IDL.Nat),
  });
  return IDL.Service({
    'createTab' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Tuple(IDL.Nat, IDL.Nat),
          IDL.Tuple(IDL.Nat, IDL.Nat),
          IDL.Opt(IDL.Nat),
        ],
        [IDL.Nat],
        [],
      ),
    'deleteDocument' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteTab' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getDocumentContent' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [],
      ),
    'getDocuments' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Nat,
              IDL.Text,
              IDL.Text,
              IDL.Tuple(IDL.Nat, IDL.Nat),
              IDL.Tuple(IDL.Nat, IDL.Nat),
            )
          ),
        ],
        ['query'],
      ),
    'getTabs' : IDL.Func([], [IDL.Vec(Tab)], ['query']),
    'updateDocumentPosition' : IDL.Func(
        [IDL.Nat, IDL.Tuple(IDL.Nat, IDL.Nat)],
        [IDL.Bool],
        [],
      ),
    'updateDocumentSize' : IDL.Func(
        [IDL.Nat, IDL.Tuple(IDL.Nat, IDL.Nat)],
        [IDL.Bool],
        [],
      ),
    'updateTabContent' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'updateTabPosition' : IDL.Func(
        [IDL.Nat, IDL.Tuple(IDL.Nat, IDL.Nat)],
        [IDL.Bool],
        [],
      ),
    'updateTabSize' : IDL.Func(
        [IDL.Nat, IDL.Tuple(IDL.Nat, IDL.Nat)],
        [IDL.Bool],
        [],
      ),
    'uploadDocument' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Nat8),
          IDL.Tuple(IDL.Nat, IDL.Nat),
          IDL.Tuple(IDL.Nat, IDL.Nat),
        ],
        [IDL.Nat],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
