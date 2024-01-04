import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { NameAccount } from "./NameAccount";
import {
  mockContact,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { ReduxStore } from "../../../providers/ReduxStore";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { checkAccountsAndUpsertContact } from "../../../utils/redux/thunks/checkAccountsAndUpsertContact";
import { renameAccount } from "../../../utils/redux/thunks/renameAccount";
import { NameAccountStep, Step, StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: NameAccountStep["account"]) => (
  <ReduxStore>
    <NameAccount account={account} goToStep={goToStep} />
  </ReduxStore>
);

const getNameInput = () => screen.getByTestId("name");
const getConfirmBtn = () => screen.getByRole("button", { name: /continue/i });

const accounts = [
  { type: "ledger" as const, nextStep: StepType.derivationPath },
  {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    nextStep: StepType.derivationPath,
  },
  {
    type: "secret_key" as const,
    secretKey: "secret key",
    nextStep: StepType.masterPassword,
  },
];

describe("<NameAccount />", () => {
  describe.each([
    { desc: "default name (not provided by user)", withNameProvided: false },
    { desc: "provided name", withNameProvided: true },
  ])("with $desc", label => {
    const labelBase = label.withNameProvided ? "Test acc" : "Account";

    describe.each(accounts)("for $type", account => {
      it(`sets a ${label.desc}`, async () => {
        render(fixture(goToStepMock, account));

        if (label.withNameProvided) {
          fireEvent.change(getNameInput(), { target: { value: labelBase } });
        }
        fireEvent.click(getConfirmBtn());

        await waitFor(() => {
          expect(goToStepMock).toHaveBeenCalledTimes(1);
        });
        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });
    });

    const existingAccountGroups = [
      {
        type: "ledger" as const,
        accounts: [mockLedgerAccount(0, labelBase), mockLedgerAccount(2, `${labelBase} 3`)],
      },
      {
        type: "social" as const,
        accounts: [mockSocialAccount(0, labelBase), mockSocialAccount(2, `${labelBase} 3`)],
      },
      {
        type: "mnemonic" as const,
        accounts: [mockMnemonicAccount(0, labelBase), mockMnemonicAccount(2, `${labelBase} 3`)],
      },
      {
        type: "secret_key" as const,
        accounts: [mockSecretKeyAccount(0, labelBase), mockSecretKeyAccount(2, `${labelBase} 3`)],
      },
    ];

    describe("for mnemonic", () => {
      const account = accounts.find(account => account.type === "mnemonic")!;

      describe.each(existingAccountGroups)("among $type accounts", existingAccountGroup => {
        it("sets group label", async () => {
          if (existingAccountGroup.type === "mnemonic") {
            store.dispatch(
              accountsSlice.actions.addMockMnemonicAccounts(existingAccountGroup.accounts)
            );
          } else {
            existingAccountGroup.accounts.forEach(account =>
              store.dispatch(accountsSlice.actions.addAccount(account))
            );
          }
          render(fixture(goToStepMock, account));

          if (label.withNameProvided) {
            fireEvent.change(getNameInput(), { target: { value: labelBase } });
          }
          fireEvent.click(getConfirmBtn());

          await waitFor(() => {
            expect(goToStepMock).toHaveBeenCalledTimes(1);
          });
          expect(goToStepMock).toHaveBeenCalledWith({
            type: account.nextStep,
            account: { ...account, label: labelBase },
          });
        });
      });

      it("among multisig accounts sets group label", async () => {
        store.dispatch(
          multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(goToStepMock, account));

        if (label.withNameProvided) {
          fireEvent.change(getNameInput(), { target: { value: labelBase } });
        }
        fireEvent.click(getConfirmBtn());

        await waitFor(() => {
          expect(goToStepMock).toHaveBeenCalledTimes(1);
        });
        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });

      it("among contacts sets group label", async () => {
        store.dispatch(checkAccountsAndUpsertContact(mockContact(1, labelBase)));
        store.dispatch(checkAccountsAndUpsertContact(mockContact(3, `${labelBase} 3`)));
        render(fixture(goToStepMock, account));

        if (label.withNameProvided) {
          fireEvent.change(getNameInput(), { target: { value: labelBase } });
        }
        fireEvent.click(getConfirmBtn());

        await waitFor(() => {
          expect(goToStepMock).toHaveBeenCalledTimes(1);
        });
        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });
    });

    describe.each(accounts.filter(account => account.type !== "mnemonic"))("for $type", account => {
      describe.each(existingAccountGroups)("among $type accounts", existingAccounts => {
        it("sets unique default label", async () => {
          if (existingAccounts.type === "mnemonic") {
            store.dispatch(
              accountsSlice.actions.addMockMnemonicAccounts(existingAccounts.accounts)
            );
          } else {
            existingAccounts.accounts.forEach(account =>
              store.dispatch(accountsSlice.actions.addAccount(account))
            );
          }
          render(fixture(goToStepMock, account));

          if (label.withNameProvided) {
            fireEvent.change(getNameInput(), { target: { value: labelBase } });
          }
          fireEvent.click(getConfirmBtn());

          await waitFor(() => {
            expect(goToStepMock).toHaveBeenCalledTimes(1);
          });
          expect(goToStepMock).toHaveBeenCalledWith({
            type: account.nextStep,
            account: { ...account, label: `${labelBase} 2` },
          });
        });
      });

      it("among multisig accounts sets unique default label", async () => {
        store.dispatch(
          multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(goToStepMock, account));

        if (label.withNameProvided) {
          fireEvent.change(getNameInput(), { target: { value: labelBase } });
        }
        fireEvent.click(getConfirmBtn());

        await waitFor(() => {
          expect(goToStepMock).toHaveBeenCalledTimes(1);
        });
        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: `${labelBase} 2` },
        });
      });

      it("among contacts sets unique default label", async () => {
        store.dispatch(checkAccountsAndUpsertContact(mockContact(1, labelBase)));
        store.dispatch(checkAccountsAndUpsertContact(mockContact(3, `${labelBase} 3`)));
        render(fixture(goToStepMock, account));

        if (label.withNameProvided) {
          fireEvent.change(getNameInput(), { target: { value: labelBase } });
        }
        fireEvent.click(getConfirmBtn());

        await waitFor(() => {
          expect(goToStepMock).toHaveBeenCalledTimes(1);
        });
        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: `${labelBase} 2` },
        });
      });
    });
  });
});
