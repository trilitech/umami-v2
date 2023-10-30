import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { multisigActions } from "../../utils/redux/slices/multisigsSlice";
import store from "../../utils/redux/store";
import { AccountTile } from "./AccountTile";
describe("<AccountTile />", () => {
  describe("icon and label", () => {
    it("mnemonic account", () => {
      const mnemonicAccount = mockMnemonicAccount(0);
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mnemonicAccount]));
      render(<AccountTile address={mnemonicAccount.address.pkh} balance="3" />);
      expect(screen.getByTestId("identicon")).toBeInTheDocument();
      expect(screen.getByText("Account 0")).toBeTruthy();
    });

    it("ledger account", () => {
      const ledgerAccount = mockLedgerAccount(0);
      store.dispatch(accountsSlice.actions.addAccount(ledgerAccount));
      render(<AccountTile address={ledgerAccount.address.pkh} balance="3" />);
      expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
      expect(screen.getByText("Account 0 ledger")).toBeTruthy();
    });

    it("social account", () => {
      const socialAccount = mockSocialAccount(0);
      store.dispatch(accountsSlice.actions.addAccount(socialAccount));
      render(<AccountTile address={socialAccount.address.pkh} balance="3" />);
      expect(screen.getByTestId("social-icon")).toBeInTheDocument();
      expect(screen.getByText("google Account 0")).toBeTruthy();
    });

    it("multisig account", () => {
      const multisig = mockMultisigAccount(0);
      store.dispatch(multisigActions.setMultisigs([multisig]));
      render(<AccountTile address={multisig.address.pkh} balance="3" />);
      expect(screen.getByTestId("key-icon")).toBeInTheDocument();
      expect(screen.getByText("Multisig Account 0")).toBeTruthy();
    });
  });
});
