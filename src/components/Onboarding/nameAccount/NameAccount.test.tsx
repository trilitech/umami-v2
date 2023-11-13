import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NameAccount from "./NameAccount";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { mockLedgerAccount } from "../../../mocks/factories";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import store from "../../../utils/redux/store";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: NameAccountStep["account"]) => (
  <ReduxStore>
    <NameAccount goToStep={goToStep} account={account} />
  </ReduxStore>
);

describe("<NameAccount />", () => {
  const accounts = [
    { type: "ledger" as const },
    { type: "mnemonic" as const, mnemonic: mnemonic1 },
  ];
  accounts.forEach(async account => {
    test(`Set a name for ${account.type}`, async () => {
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
  });

  test(`Set no name for mnemonic`, async () => {
    const account = { type: "mnemonic" as const, mnemonic: mnemonic1 };
    render(fixture(goToStepMock, account));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(goToStepMock).toBeCalledTimes(1);
    });
    expect(goToStepMock).toBeCalledWith({
      type: StepType.derivationPath,
      account: { ...account, label: "Account 1" },
    });
  });

  test(`Set no name for ledger`, async () => {
    const account = { type: "ledger" as const };
    render(fixture(goToStepMock, account));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(goToStepMock).toBeCalledTimes(1);
    });
    expect(goToStepMock).toBeCalledWith({
      type: StepType.derivationPath,
      account: { ...account, label: "Ledger Account 1" },
    });
  });

  test(`Use first available default label for ledger`, async () => {
    // Add accounts with default names "Ledger Account 1", "Ledger Account 2" & "Ledger Account 4".
    store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
    store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));
    store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(3)));

    const account = { type: "ledger" as const };
    render(fixture(goToStepMock, account));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(goToStepMock).toBeCalledTimes(1);
    });
    expect(goToStepMock).toBeCalledWith({
      type: StepType.derivationPath,
      account: { ...account, label: "Ledger Account 3" },
    });
  });
});
