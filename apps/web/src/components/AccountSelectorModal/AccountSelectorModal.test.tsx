import {
  getAccountGroupLabel,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  addTestAccounts,
  initializePersistence,
  makeStore,
} from "@umami/state";

import { AccountSelectorModal } from "./AccountSelectorModal";
import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
import * as RemoveAccountModal from "./RemoveAccountModal";
import {
  act,
  dynamicModalContextMock,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../testUtils";
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccounts(store, [mockMnemonicAccount(0), mockLedgerAccount(1), mockSocialAccount(2)]);
  initializePersistence(store, mockMnemonicAccount(0).pk);
  store.dispatch(accountsActions.setDefaultAccount());
});

describe("<AccountSelectorModal />", () => {
  it("renders account groups correctly", async () => {
    await renderInModal(<AccountSelectorModal />, store);

    await waitFor(() =>
      expect(screen.getByText(`Seedphrase ${mockMnemonicAccount(0).seedFingerPrint}`)).toBeVisible()
    );
    expect(screen.getByText("Social accounts")).toBeVisible();
    expect(screen.getByText("Ledger accounts")).toBeVisible();
  });

  it.each([
    ["ledger", mockLedgerAccount(1)],
    ["social", mockSocialAccount(2)],
    ["secret_key", mockSecretKeyAccount(1)],
  ])("doesn't have 'Derive account' button for %s group", async (_, account) => {
    const accountLabel = getAccountGroupLabel(account);

    await renderInModal(<AccountSelectorModal />, store);

    expect(screen.queryByLabelText(`Add ${accountLabel} account`)).not.toBeInTheDocument();
  });

  it("opens modal when clicking 'Derive account' button for mnemonic group", async () => {
    const user = userEvent.setup();
    const accountLabel = getAccountGroupLabel(mockMnemonicAccount(0));
    const { openWith } = dynamicModalContextMock;

    await renderInModal(<AccountSelectorModal />, store);

    await act(() => user.click(screen.getByLabelText(`Add ${accountLabel} account`)));
    expect(openWith).toHaveBeenCalledWith(
      <DeriveMnemonicAccountModal account={mockMnemonicAccount(0)} />
    );
  });

  describe("when clicking 'Remove account group' button", () => {
    it.each([
      ["mnemonic", mockMnemonicAccount(0)],
      ["ledger", mockLedgerAccount(1)],
      ["social", mockSocialAccount(2)],
    ])(
      "opens confirmation modal when clicking remove button for %s accounts",
      async (type, account) => {
        const isDefaultAccount =
          store.getState().accounts.defaultAccount?.address.pkh === account.address.pkh;
        const user = userEvent.setup();
        await renderInModal(<AccountSelectorModal />, store);
        const accountLabel = getAccountGroupLabel(account);

        const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
        await act(() => user.click(removeButton));

        expect(screen.getByText("Remove all accounts")).toBeInTheDocument();

        const expectedMessage = isDefaultAccount
          ? "Removing your default account will off-board you from Umami."
          : type === "mnemonic"
            ? `Are you sure you want to remove all accounts derived from the ${accountLabel}? You will need to manually import them again.`
            : `Are you sure you want to remove all of your ${accountLabel}? You will need to manually import them again.`;

        await waitFor(() =>
          expect(screen.getByText(content => content.includes(expectedMessage))).toBeVisible()
        );

        if (type === "mnemonic") {
          expect(
            screen.getByText(
              "Make sure your mnemonic phrase is securely saved. Losing this phrase could result in permanent loss of access to your data."
            )
          ).toBeVisible();
        }
      }
    );

    it("removes mnemonic accounts when confirmed", async () => {
      jest.spyOn(RemoveAccountModal, "HandleRemoveDefaultAccount");
      const user = userEvent.setup();
      await renderInModal(<AccountSelectorModal />, store);
      const account = mockMnemonicAccount(0);
      const accountLabel = getAccountGroupLabel(account);
      const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
      await act(() => user.click(removeButton));

      const isDefaultAccount =
        store.getState().accounts.defaultAccount?.address.pkh === account.address.pkh;
      const confirmButton = screen.getByText(isDefaultAccount ? "Remove & off-board" : "Remove");
      await act(() => user.click(confirmButton));

      expect(store.getState().accounts.seedPhrases[account.seedFingerPrint]).toBe(undefined);
      if (isDefaultAccount) {
        await waitFor(() =>
          expect(RemoveAccountModal.HandleRemoveDefaultAccount).toHaveBeenCalled()
        );
      } else {
        expect(store.getState().accounts.items.length).toBe(2);
      }
    });

    it.each([
      ["ledger", mockLedgerAccount(1)],
      ["social", mockSocialAccount(2)],
    ])("removes %s accounts when confirmed", async (_, account) => {
      const user = userEvent.setup();
      await renderInModal(<AccountSelectorModal />, store);
      const accountLabel = getAccountGroupLabel(account);
      const accounts = store.getState().accounts.items;

      const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
      await act(() => user.click(removeButton));

      const confirmButton = screen.getByText("Remove");
      await act(() => user.click(confirmButton));

      expect(store.getState().accounts.items.length).toBe(accounts.length - 1);
    });

    it('shows "Remove & Off-board" message when removing last group of accounts', async () => {
      store.dispatch(accountsActions.reset());
      addTestAccount(store, mockSocialAccount(0));
      store.dispatch(accountsActions.setDefaultAccount());
      initializePersistence(store, mockSocialAccount(0).pk);

      const user = userEvent.setup();
      const accountLabel = getAccountGroupLabel(mockSocialAccount(0));
      await renderInModal(<AccountSelectorModal />, store);

      const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
      await act(() => user.click(removeButton));

      expect(screen.getByText("Remove & off-board")).toBeInTheDocument();

      const expectedMessage = "Removing your default account will off-board you from Umami.";

      await waitFor(() =>
        expect(screen.getByText(content => content.includes(expectedMessage))).toBeVisible()
      );
    });
  });

  it("opens appropriate modal when clicking 'Add Account' button", async () => {
    const user = userEvent.setup();
    const { openWith } = dynamicModalContextMock;
    await renderInModal(<AccountSelectorModal />, store);

    await act(() => user.click(screen.getByText("Add account")));

    expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
  });

  it("correctly handles account selection", async () => {
    const user = userEvent.setup();
    const { onClose } = dynamicModalContextMock;
    await renderInModal(<AccountSelectorModal />, store);

    const accountTile = screen.getByText(mockMnemonicAccount(0).label);
    await act(() => user.click(accountTile));

    expect(store.getState().accounts.current).toBe(mockMnemonicAccount(0).address.pkh);
    expect(onClose).toHaveBeenCalled();
  });

  describe("when account is not verified", () => {
    beforeEach(() => {
      store.dispatch(accountsActions.setCurrent(mockLedgerAccount(0).address.pkh));
      store.dispatch(
        accountsActions.setIsVerified({
          pkh: mockLedgerAccount(0).address.pkh,
          isVerified: false,
        })
      );
    });

    it("renders 'Add account' button", async () => {
      await renderInModal(<AccountSelectorModal />, store);

      expect(screen.queryByText("Add account")).toBeVisible();
    });

    it("opens appropriate modal when clicking 'Add Account' button", async () => {
      const user = userEvent.setup();
      const { openWith } = dynamicModalContextMock;
      await renderInModal(<AccountSelectorModal />, store);

      await act(() => user.click(screen.getByText("Add account")));

      expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
    });
  });
});
