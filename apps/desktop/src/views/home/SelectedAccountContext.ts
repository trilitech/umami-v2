import { type Account } from "@umami/core";
import { createContext } from "react";

export const SelectedAccountContext = createContext<{
  selectAccount: (account: Account | null) => void;
  selectedAccount: Account | null;
}>({
  selectedAccount: null,
  selectAccount: () => {},
});
