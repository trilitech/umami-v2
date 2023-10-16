import {
  mockImplicitAccount,
  mockMultisigAccount,
  mockSocialOrLedgerAccount,
} from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { AccountType } from "../../types/Account";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { multisigActions } from "../../utils/redux/slices/multisigsSlice";
import store from "../../utils/redux/store";
import { AccountTile } from "./AccountTile";
describe("<AccountTile />", () => {
  describe("icon and label", () => {
    it("mnemonic account", () => {
      const implicitAccount0 = mockImplicitAccount(0);
      store.dispatch(accountsSlice.actions.addNonMnemonicAccount([implicitAccount0 as any]));
      render(<AccountTile address={implicitAccount0.address.pkh} balance="3" />);
      expect(screen.getByTestId("identicon")).toBeInTheDocument();
      expect(screen.getByText("Account 0")).toBeTruthy();
    });

    it("ledger account", () => {
      const implicitAccount0 = mockSocialOrLedgerAccount(0, AccountType.LEDGER);
      store.dispatch(accountsSlice.actions.addNonMnemonicAccount([implicitAccount0]));
      render(<AccountTile address={implicitAccount0.address.pkh} balance="3" />);
      expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
      expect(screen.getByText("Account 0 ledger")).toBeTruthy();
    });

    it("social account", () => {
      const implicitAccount0 = mockSocialOrLedgerAccount(0);
      store.dispatch(accountsSlice.actions.addNonMnemonicAccount([implicitAccount0]));
      render(<AccountTile address={implicitAccount0.address.pkh} balance="3" />);
      expect(screen.getByTestId("social-icon")).toBeInTheDocument();
      expect(screen.getByText("google Account 0")).toBeTruthy();
    });

    it("multisig account", () => {
      const multisig = mockMultisigAccount(0);
      store.dispatch(multisigActions.setMultisigs([multisig]));
      render(<AccountTile address={multisig.address.pkh} balance="3" />);
      expect(screen.getByTestId("key-icon")).toBeInTheDocument();
      expect(screen.getByText("label")).toBeTruthy();
    });
  });
});
