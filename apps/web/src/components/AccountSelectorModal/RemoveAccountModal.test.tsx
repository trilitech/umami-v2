import { mockSocialAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  addTestAccounts,
  makeStore,
  useRemoveAccount,
} from "@umami/state";

import { RemoveAccountModal } from "./RemoveAccountModal";
import {
  act,
  dynamicModalContextMock,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../testUtils";

const accounts = [mockSocialAccount(0), mockSocialAccount(1)];

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useRemoveAccount: jest.fn(),
}));

describe("<RemoveAccountModal />", () => {
  const mockRemoveAccount = jest.fn();

  beforeEach(() => {
    jest.mocked(useRemoveAccount).mockReturnValue(mockRemoveAccount);
  });

  it("renders with default description and button label", async () => {
    addTestAccounts(store, accounts);
    store.dispatch(accountsActions.setDefaultAccount());
    await renderInModal(<RemoveAccountModal account={accounts[1]} />, store);

    await waitFor(() => expect(screen.getByText("Remove account")).toBeVisible());
    expect(
      screen.getByText(text =>
        text.includes(
          "Are you sure you want to remove this account? You will need to manually import it again."
        )
      )
    ).toBeVisible();
    expect(screen.getByText("Remove")).toBeVisible();
  });

  it("renders with off-board description and button label when it's the last implicit account", async () => {
    addTestAccount(store, accounts[0]);
    store.dispatch(accountsActions.setDefaultAccount());
    await renderInModal(<RemoveAccountModal account={accounts[0]} />, store);

    await waitFor(() => expect(screen.getByText("Remove account")).toBeVisible());
    expect(screen.getByText("Remove & off-board")).toBeVisible();
    expect(
      screen.getByText(text =>
        text.includes("Removing your default account will off-board you from Umami")
      )
    ).toBeVisible();
  });

  it("handles account removal and navigates correctly when only one account", async () => {
    addTestAccount(store, accounts[0]);
    store.dispatch(accountsActions.setDefaultAccount());
    const { onClose } = dynamicModalContextMock;
    const user = userEvent.setup();

    await renderInModal(<RemoveAccountModal account={accounts[0]} />, store);

    await act(() => user.click(screen.getByText("Remove & off-board")));

    expect(onClose).toHaveBeenCalled();
  });

  it("handles account removal and goes back correctly", async () => {
    addTestAccounts(store, accounts);
    store.dispatch(accountsActions.setDefaultAccount());
    const user = userEvent.setup();
    const { goBack } = dynamicModalContextMock;

    await renderInModal(<RemoveAccountModal account={accounts[1]} />, store);

    await act(() => user.click(screen.getByText("Remove")));

    expect(goBack).toHaveBeenCalled();
  });
});
