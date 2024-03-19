import { NameAccount } from "./NameAccount";
import {
  mockContact,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { contactsActions } from "../../../utils/redux/slices/contactsSlice";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { renameAccount } from "../../../utils/redux/thunks/renameAccount";
import type { NameAccountStep } from "../OnboardingStep";

const goToStepMock = jest.fn();

const fixture = (account: NameAccountStep["account"]) => (
  <NameAccount account={account} goToStep={goToStepMock} />
);

const getNameInput = () => screen.getByTestId("name");
const getConfirmBtn = () => screen.getByRole("button", { name: "Continue" });

const accounts = [
  { type: "ledger" as const, nextStep: "derivationPath" },
  {
    type: "mnemonic" as const,
    mnemonic: mnemonic1,
    nextStep: "derivationPath",
  },
  {
    type: "secret_key" as const,
    secretKey: "secret key",
    nextStep: "masterPassword",
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
        const user = userEvent.setup();
        render(fixture(account));

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

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
          const user = userEvent.setup();
          existingAccountGroup.accounts.forEach(addAccount);
          render(fixture(account));

          if (label.withNameProvided) {
            await act(() => user.type(getNameInput(), labelBase));
          }
          await act(() => user.click(getConfirmBtn()));

          expect(goToStepMock).toHaveBeenCalledWith({
            type: account.nextStep,
            account: { ...account, label: labelBase },
          });
        });
      });

      it("among multisig accounts sets group label", async () => {
        const user = userEvent.setup();
        store.dispatch(
          multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(account));

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });

      it("among contacts sets group label", async () => {
        const user = userEvent.setup();
        store.dispatch(contactsActions.upsert(mockContact(1, labelBase)));
        store.dispatch(contactsActions.upsert(mockContact(3, `${labelBase} 3`)));
        render(fixture(account));

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });
    });

    describe.each(accounts.filter(account => account.type !== "mnemonic"))("for $type", account => {
      describe.each(existingAccountGroups)("among $type accounts", existingAccounts => {
        it("sets unique default label", async () => {
          const user = userEvent.setup();
          if (existingAccounts.type === "mnemonic") {
            store.dispatch(
              accountsSlice.actions.addMockMnemonicAccounts(existingAccounts.accounts)
            );
          } else {
            existingAccounts.accounts.forEach(account =>
              store.dispatch(accountsSlice.actions.addAccount(account))
            );
          }
          render(fixture(account));

          if (label.withNameProvided) {
            await act(() => user.type(getNameInput(), labelBase));
          }
          await act(() => user.click(getConfirmBtn()));

          expect(goToStepMock).toHaveBeenCalledWith({
            type: account.nextStep,
            account: { ...account, label: `${labelBase} 2` },
          });
        });
      });

      it("among multisig accounts sets unique default label", async () => {
        const user = userEvent.setup();
        store.dispatch(
          multisigActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(account));

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: `${labelBase} 2` },
        });
      });

      it("among contacts sets unique default label", async () => {
        const user = userEvent.setup();
        store.dispatch(contactsActions.upsert(mockContact(1, labelBase)));
        store.dispatch(contactsActions.upsert(mockContact(3, `${labelBase} 3`)));
        render(fixture(account));

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: `${labelBase} 2` },
        });
      });
    });
  });
});
