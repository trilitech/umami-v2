import {
  BeaconMessageType,
  NetworkType,
  type PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { fireEvent, waitFor } from "@testing-library/react";
import { mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, WalletClient, addTestAccounts, makeStore } from "@umami/state";

import { PermissionRequestModal } from "./PermissionRequestModal";
import { act, renderInModal, screen, userEvent } from "../../testUtils";

const SENDER_ID = "mockSenderId";
const DAPP_NAME = "mockDappName";
const MESSAGE_ID = "mockMessageId";
const SCOPES = [PermissionScope.SIGN];

const request: PermissionRequestOutput = {
  appMetadata: { name: DAPP_NAME, senderId: SENDER_ID },
  id: MESSAGE_ID,
  network: { type: NetworkType.MAINNET },
  scopes: SCOPES,
  senderId: SENDER_ID,
  type: BeaconMessageType.PermissionRequest,
  version: "2",
};

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccounts(store, [mockMnemonicAccount(1), mockMnemonicAccount(2), mockMnemonicAccount(3)]);
});

describe("<PermissionRequestModal />", () => {
  it("requires the account", async () => {
    await renderInModal(<PermissionRequestModal request={request} />, store);
    const grantButton = screen.getByRole("button", { name: "Allow" });

    expect(grantButton).toBeDisabled();

    fireEvent.blur(screen.getByLabelText("address"));

    await screen.findByText("Invalid address or contact name");
  });

  it("allows user to select account and grant permission", async () => {
    const user = userEvent.setup();

    jest.spyOn(WalletClient, "respond");

    await renderInModal(<PermissionRequestModal request={request} />, store);

    // select account
    const account = mockMnemonicAccount(1);
    const input = screen.getByLabelText("address");
    await act(() => user.type(input, account.address.pkh));

    // grant permission
    const grantButton = screen.getByRole("button", { name: "Allow" });
    expect(grantButton).toBeEnabled();
    await act(() => user.click(grantButton));

    expect(WalletClient.respond).toHaveBeenCalledWith({
      id: MESSAGE_ID,
      network: { type: "mainnet" },
      publicKey: account.pk,
      scopes: SCOPES,
      type: "permission_response",
      walletType: "implicit",
    });
  });

  it("saves new connection to beaconSlice", async () => {
    const user = userEvent.setup();

    await renderInModal(<PermissionRequestModal request={request} />, store);

    // select account
    const account = mockMnemonicAccount(1);
    const input = screen.getByLabelText("address");
    await act(() => user.type(input, account.address.pkh));

    // grant permission
    const grantButton = screen.getByRole("button", { name: "Allow" });
    expect(grantButton).toBeEnabled();
    await waitFor(async () => {
      await act(() => user.click(grantButton));
    });

    expect(store.getState().beacon).toEqual({
      [SENDER_ID]: {
        accountPkh: mockMnemonicAccount(1).address.pkh,
        networkType: NetworkType.MAINNET,
      },
    });
  });
});
