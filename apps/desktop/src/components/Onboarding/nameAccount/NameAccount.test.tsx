import {
  mockContractContact,
  mockImplicitContact,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  contactsActions,
  makeStore,
  multisigsActions,
  networksActions,
  renameAccount,
} from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";
import { MAINNET } from "@umami/tezos";

import { NameAccount } from "./NameAccount";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import type { NameAccountStep } from "../OnboardingStep";

const goToStepMock = jest.fn();

const fixture = (account: NameAccountStep["account"]) => (
  <NameAccount account={account} goToStep={goToStepMock} />
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

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
        render(fixture(account), { store });

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
          existingAccountGroup.accounts.forEach(account => addTestAccount(store, account));
          render(fixture(account), { store });

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
          multisigsActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(account), { store });

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: labelBase },
        });
      });

      it("among all contacts sets group label", async () => {
        const user = userEvent.setup();
        store.dispatch(networksActions.setCurrent(MAINNET));
        store.dispatch(contactsActions.upsert(mockImplicitContact(1, labelBase)));
        store.dispatch(
          contactsActions.upsert(mockContractContact(0, "ghostnet", `${labelBase} 3`))
        );
        store.dispatch(contactsActions.upsert(mockContractContact(2, "mainnet", `${labelBase} 7`)));
        render(fixture(account), { store });

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
          existingAccounts.accounts.forEach(account => addTestAccount(store, account));

          render(fixture(account), { store });

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
          multisigsActions.setMultisigs([mockMultisigAccount(0), mockMultisigAccount(1)])
        );
        store.dispatch(renameAccount(mockMultisigAccount(0), labelBase));
        store.dispatch(renameAccount(mockMultisigAccount(1), `${labelBase} 3`));
        render(fixture(account), { store });

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
        store.dispatch(networksActions.setCurrent(MAINNET));
        store.dispatch(contactsActions.upsert(mockImplicitContact(1, labelBase)));
        store.dispatch(
          contactsActions.upsert(mockContractContact(0, "ghostnet", `${labelBase} 2`))
        );
        store.dispatch(contactsActions.upsert(mockContractContact(2, "mainnet", `${labelBase} 4`)));
        render(fixture(account), { store });

        if (label.withNameProvided) {
          await act(() => user.type(getNameInput(), labelBase));
        }
        await act(() => user.click(getConfirmBtn()));

        expect(goToStepMock).toHaveBeenCalledWith({
          type: account.nextStep,
          account: { ...account, label: `${labelBase} 3` },
        });
      });
    });
  });
});
