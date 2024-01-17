import { createContext } from "react";

import { Account } from "../../types/Account";

export const SelectedAccountContext = createContext<{
  selectAccount: (account: Account | null) => void;
  selectedAccount: Account | null;
}>({
  selectedAccount: null,
  selectAccount: () => {},
});
