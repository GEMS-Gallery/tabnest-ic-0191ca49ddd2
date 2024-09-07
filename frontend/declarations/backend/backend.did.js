export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Tab = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'tabType' : IDL.Text,
    'size' : IDL.Tuple(IDL.Nat, IDL.Nat),
    'timestamp' : Time,
    'position' : IDL.Tuple(IDL.Nat, IDL.Nat),
  });
  return IDL.Service({
    'createTab' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Tuple(IDL.Nat, IDL.Nat),
          IDL.Tuple(IDL.Nat, IDL.Nat),
        ],
        [IDL.Nat],
        [],
      ),
    'deleteTab' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTabs' : IDL.Func([], [IDL.Vec(Tab)], ['query']),
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
  });
};
export const init = ({ IDL }) => { return []; };
