import {
  BeaconMessageType,
  NetworkType,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";
import { fireEvent } from "@testing-library/react";

import { PermissionRequestModal } from "./PermissionRequestModal";
import { WalletClient } from "./WalletClient";
import { mockMnemonicAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("./WalletClient");

const TestComponent = ({ request }: { request: PermissionRequestOutput }) => (
  <Modal isOpen={true} onClose={() => {}}>
    <PermissionRequestModal request={request} />
  </Modal>
);

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

beforeEach(() =>
  [mockMnemonicAccount(1), mockMnemonicAccount(2), mockMnemonicAccount(3)].forEach(addAccount)
);

describe("<PermissionRequestModal />", () => {
  it("requires the account", async () => {
    render(<TestComponent request={request} />);
    const grantButton = screen.getByRole("button", { name: "Allow" });

    expect(grantButton).toBeDisabled();

    fireEvent.blur(screen.getByLabelText("address"));

    await screen.findByText("Invalid address or contact name");
  });

  it("allows user to select account and grant permission", async () => {
    const user = userEvent.setup();

    render(<TestComponent request={request} />);

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

    render(<TestComponent request={request} />);

    // select account
    const account = mockMnemonicAccount(1);
    const input = screen.getByLabelText("address");
    await act(() => user.type(input, account.address.pkh));

    // grant permission
    const grantButton = screen.getByRole("button", { name: "Allow" });
    expect(grantButton).toBeEnabled();
    await act(() => user.click(grantButton));

    expect(store.getState().beacon).toEqual({
      [SENDER_ID]: {
        accountPkh: mockMnemonicAccount(1).address.pkh,
        networkType: NetworkType.MAINNET,
      },
    });
  });
});
