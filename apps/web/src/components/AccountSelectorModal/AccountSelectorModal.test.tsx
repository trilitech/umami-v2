import {
  getAccountGroupLabel,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSocialAccount,
} from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  addTestAccounts,
  makeStore,
} from "@umami/state";

import { AccountSelectorModal } from "./AccountSelectorModal";
import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
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
});

describe("<AccountSelectorModal />", () => {
  it("renders account groups correctly", async () => {
    await renderInModal(<AccountSelectorModal />, store);

    await waitFor(() =>
      expect(screen.getByText(`Seedphrase ${mockMnemonicAccount(0).seedFingerPrint}`)).toBeVisible()
    );
    expect(screen.getByText("Social Accounts")).toBeVisible();
    expect(screen.getByText("Ledger Accounts")).toBeVisible();
  });

  it.each([
    [
      "mnemonic",
      mockMnemonicAccount(0),
      () => <DeriveMnemonicAccountModal account={mockMnemonicAccount(0)} />,
    ],
    ["ledger", mockLedgerAccount(1), () => <OnboardOptionsModal />],
    ["social", mockSocialAccount(2), () => <OnboardOptionsModal />],
  ])(
    "open appropriate modal when clicking 'Add %s Account' button",
    async (_, account, getModalComponent) => {
      const user = userEvent.setup();
      const accountLabel = getAccountGroupLabel(account);
      const { openWith } = dynamicModalContextMock;
      await renderInModal(<AccountSelectorModal />, store);

      await act(() => user.click(screen.getByLabelText(`Add ${accountLabel} account`)));

      expect(openWith).toHaveBeenCalledWith(getModalComponent());
    }
  );

  describe("when clicking 'Remove account group' button", () => {
    it.each([
      ["mnemonic", mockMnemonicAccount(0)],
      ["ledger", mockLedgerAccount(1)],
      ["social", mockSocialAccount(2)],
    ])(
      "opens confirmation modal when clicking remove button for %s accounts",
      async (_, account) => {
        const user = userEvent.setup();
        await renderInModal(<AccountSelectorModal />, store);
        const accountLabel = getAccountGroupLabel(account);

        const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
        await act(() => user.click(removeButton));

        expect(screen.getByText("Remove All Accounts")).toBeInTheDocument();

        await waitFor(() =>
          expect(
            screen.getByText(
              `Are you sure you want to remove all accounts derived from the ${accountLabel}? You will need to manually import them again.`
            )
          ).toBeVisible()
        );
      }
    );

    it("removes mnemonic accounts when confirmed", async () => {
      const user = userEvent.setup();
      await renderInModal(<AccountSelectorModal />, store);
      const account = mockMnemonicAccount(0);
      const accountLabel = getAccountGroupLabel(account);
      const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
      await act(() => user.click(removeButton));

      const confirmButton = screen.getByText("Remove");
      await act(() => user.click(confirmButton));

      expect(store.getState().accounts.seedPhrases[account.seedFingerPrint]).toBe(undefined);
      expect(store.getState().accounts.items.length).toBe(2);
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

      const user = userEvent.setup();
      const accountLabel = getAccountGroupLabel(mockSocialAccount(0));
      await renderInModal(<AccountSelectorModal />, store);

      const removeButton = screen.getByLabelText(`Remove ${accountLabel} accounts`);
      await act(() => user.click(removeButton));

      expect(screen.getByText("Remove & Off-board")).toBeInTheDocument();

      await waitFor(() =>
        expect(
          screen.getByText(
            "Removing all your accounts will off-board you from Umami. This will remove or reset all customized settings to their defaults. Personal data (including saved contacts, password and accounts) won't be affected."
          )
        ).toBeVisible()
      );
    });
  });

  it("opens appropriate modal when clicking 'Add Account' button", async () => {
    const user = userEvent.setup();
    const { openWith } = dynamicModalContextMock;
    await renderInModal(<AccountSelectorModal />, store);

    await act(() => user.click(screen.getByText("Add Account")));

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

    it("does not render 'Add Account' button", async () => {
      await renderInModal(<AccountSelectorModal />, store);

      expect(screen.queryByText("Add Account")).not.toBeInTheDocument();
    });
  });
});
