import {
  getAccountGroupLabel,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSocialAccount,
} from "@umami/core";
import { type UmamiStore, accountsActions, addTestAccounts, makeStore } from "@umami/state";

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
