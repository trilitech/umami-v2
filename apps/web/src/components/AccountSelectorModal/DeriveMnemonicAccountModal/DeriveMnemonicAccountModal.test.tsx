import { mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, useDeriveMnemonicAccount } from "@umami/state";

import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../../testUtils";

let store: UmamiStore;

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useDeriveMnemonicAccount: jest.fn(),
}));

const mockDeriveMnemonicAccount = jest.fn();

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0));

  jest.mocked(useDeriveMnemonicAccount).mockImplementation(() => mockDeriveMnemonicAccount);
});

describe("<DeriveMnemonicAccountModal />", () => {
  it("renders the NameAccountModal with correct subtitle", async () => {
    const account = mockMnemonicAccount(0);
    await renderInModal(<DeriveMnemonicAccountModal account={account} />, store);

    await waitFor(() => {
      expect(screen.getByText("Name Your Account")).toBeVisible();
    });

    expect(
      screen.getByText(`Name the new account derived from seedphrase ${account.seedFingerPrint}`)
    ).toBeVisible();
  });

  it("handles name submission and opens confirm password modal", async () => {
    const user = userEvent.setup();

    const account = mockMnemonicAccount(0);
    await renderInModal(<DeriveMnemonicAccountModal account={account} />, store);
    await act(() => user.type(screen.getByLabelText("Account name (Optional)"), "Test Account"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    await waitFor(() => {
      expect(screen.getByTestId("master-password-modal")).toBeVisible();
    });
  });

  it("derives mnemonic account on password submission", async () => {
    const user = userEvent.setup();

    const account = mockMnemonicAccount(0);
    await renderInModal(<DeriveMnemonicAccountModal account={account} />, store);

    await act(() => user.type(screen.getByLabelText("Account name (Optional)"), "Test Account"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));
    await act(() => user.type(screen.getByLabelText("Password"), "test-password"));
    await act(() => user.click(screen.getByRole("button", { name: "Submit" })));

    expect(mockDeriveMnemonicAccount).toHaveBeenCalledWith({
      fingerPrint: account.seedFingerPrint,
      password: "test-password",
      label: "Test Account",
    });

    expect(screen.queryByTestId("master-password-modal")).not.toBeInTheDocument();
  });
});
