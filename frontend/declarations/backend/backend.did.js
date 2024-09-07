export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Tab = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'tabType' : IDL.Text,
    'timestamp' : Time,
  });
  return IDL.Service({
    'createTab' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'deleteTab' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTabs' : IDL.Func([], [IDL.Vec(Tab)], ['query']),
    'updateTabContent' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
