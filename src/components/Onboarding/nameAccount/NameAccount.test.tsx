import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NameAccount from "./NameAccount";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import store from "../../../utils/redux/store";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import renameAccount from "../../../utils/redux/thunks/renameAccount";
import { contactsActions } from "../../../utils/redux/slices/contactsSlice";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: NameAccountStep["account"]) => (
  <ReduxStore>
    <NameAccount account={account} goToStep={goToStep} />
  </ReduxStore>
);

describe("<NameAccount />", () => {
  const accounts = [
    { type: "ledger" as const, defaultLabel: "Account 1", nextStep: StepType.derivationPath },
    {
      type: "mnemonic" as const,
      mnemonic: mnemonic1,
      defaultLabel: "Account",
      nextStep: StepType.derivationPath,
    },
    {
      type: "secret_key" as const,
      secretKey: "secret key",
      defaultLabel: "Account 1",
      nextStep: StepType.masterPassword,
    },
  ];

  describe.each(accounts)("For $type", account => {
    it("sets a provided name", async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const name = screen.getByTestId("name");
      fireEvent.change(name, { target: { value: "name" } });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: account.nextStep,
        account: { ...account, label: "name" },
      });
    });

    it("sets a default name if none is provided", async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: account.nextStep,
        account: { ...account, label: account.defaultLabel },
      });
    });
  });

  describe.each(accounts.filter(account => account.type !== "mnemonic"))("For $type", account => {
    const existingAccounts = [
      {
        type: "ledger" as const,
        accounts: [mockLedgerAccount(0, "Account 1"), mockLedgerAccount(2, "Account 3")],
      },
      {
        type: "social" as const,
        accounts: [mockSocialAccount(0, "Account 1"), mockSocialAccount(2, "Account 3")],
      },
      {
        type: "mnemonic" as const,
        accounts: [mockMnemonicAccount(0, "Account 1"), mockMnemonicAccount(2, "Account 3")],
      },
      {
        type: "secret_key" as const,
        accounts: [mockSecretKeyAccount(0, "Account 1"), mockSecretKeyAccount(2, "Account 3")],
      },
    ];
    describe.each(existingAccounts)("among $type accounts", existingAccounts => {
      it("sets unique default label", async () => {
        if (existingAccounts.type === "mnemonic") {
          store.dispatch(accountsSlice.actions.addMockMnemonicAccounts(existingAccounts.accounts));
        } else {
          existingAccounts.accounts.forEach(account =>
            store.dispatch(accountsSlice.actions.addAccount(account))
          );
        }

        render(fixture(goToStepMock, account));
        const confirmBtn = screen.getByRole("button", { name: /continue/i });
        fireEvent.click(confirmBtn);

        await waitFor(() => {
          expect(goToStepMock).toBeCalledTimes(1);
        });
        expect(goToStepMock).toBeCalledWith({
          type: account.nextStep,
          account: { ...account, label: "Account 2" },
        });
      });
    });

    it("among multisig accounts sets unique default label", async () => {
      store.dispatch(
        multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
      );
      store.dispatch(renameAccount(mockMultisigAccount(0), "Account 1"));
      store.dispatch(renameAccount(mockMultisigAccount(1), "Account 3"));

      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: account.nextStep,
        account: { ...account, label: "Account 2" },
      });
    });

    it("among contacts sets unique default label", async () => {
      store.dispatch(contactsActions.upsert({ name: "Account 1", pkh: "pkh1" }));
      store.dispatch(contactsActions.upsert({ name: "Account 3", pkh: "pkh3" }));

      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: account.nextStep,
        account: { ...account, label: "Account 2" },
      });
    });
  });
});
