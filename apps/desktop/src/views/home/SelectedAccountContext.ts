import { createContext } from "react";

import { type Account } from "../../types/Account";

export const SelectedAccountContext = createContext<{
  selectAccount: (account: Account | null) => void;
  selectedAccount: Account | null;
}>({
  selectedAccount: null,
  selectAccount: () => {},
});
