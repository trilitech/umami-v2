import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NameAccount from "./NameAccount";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import store from "../../../utils/redux/store";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: NameAccountStep["account"]) => (
  <ReduxStore>
    <NameAccount goToStep={goToStep} account={account} />
  </ReduxStore>
);

describe("<NameAccount />", () => {
  const accounts = [
    { type: "ledger" as const, defaultLabel: "Ledger Account 1" },
    { type: "mnemonic" as const, mnemonic: mnemonic1, defaultLabel: "Account 1" },
  ];
  describe.each(accounts)("For $type", account => {
    test("sets a provided name", async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const name = screen.getByTestId("name");
      fireEvent.change(name, { target: { value: "name" } });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        account: { ...account, label: "name" },
      });
    });

    test("sets a default name if none is provided", async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        account: { ...account, label: account.defaultLabel },
      });
    });
  });

  test("Use first available default label for ledger", async () => {
    store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0, "Ledger Account 1")));
    store.dispatch(accountsSlice.actions.addAccount(mockSocialAccount(1, "Ledger Account 2")));
    store.dispatch(
      accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(2, "Ledger Account 3")])
    );
    store.dispatch(multisigActions.setMultisigs([mockMultisigAccount(3, "Ledger Account 4")]));
    store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(5, "Ledger Account 6")));

    const account = { type: "ledger" as const };
    render(fixture(goToStepMock, account));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(goToStepMock).toBeCalledTimes(1);
    });
    expect(goToStepMock).toBeCalledWith({
      type: StepType.derivationPath,
      account: { ...account, label: "Ledger Account 5" },
    });
  });
});
