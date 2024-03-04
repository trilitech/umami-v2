import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { mockMnemonicAccount } from "../../../mocks/factories";
import { dispatchMockAccounts, mockEstimatedFee } from "../../../mocks/helpers";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { store } from "../../redux/store";
import { executeOperations } from "../../tezos";
import { walletClient } from "../beacon";

import { BeaconNotification } from ".";

jest.mock("../beacon");

const SENDER_ID = "mockSenderId";
const DAPP_NAME = "mockDappName";
const MESSAGE_ID = "mockMessageId";
const SCOPES = [PermissionScope.SIGN];
const BATCH_OP_HASH = { opHash: "bar" };

const fixture = (message: BeaconRequestOutputMessage) => (
  <Modal isOpen={true} onClose={() => {}}>
    <BeaconNotification message={message} onClose={() => {}} />
  </Modal>
);

beforeEach(() => {
  mockEstimatedFee(10);
  jest
    .mocked(executeOperations)
    .mockResolvedValue({ opHash: BATCH_OP_HASH.opHash } as BatchWalletOperation);
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2), mockMnemonicAccount(3)]);
});

describe("<BeaconRequestNotification />", () => {
  describe("permission request", () => {
    const message: PermissionRequestOutput = {
      appMetadata: { name: DAPP_NAME, senderId: SENDER_ID },
      id: MESSAGE_ID,
      network: { type: NetworkType.MAINNET },
      scopes: SCOPES,
      senderId: SENDER_ID,
      type: BeaconMessageType.PermissionRequest,
      version: "",
    };

    it("should display permission request", () => {
      render(fixture(message));

      expect(screen.getByText(/Permission request/i)).toBeInTheDocument();
    });

    it("allows user to select account and grant permission", async () => {
      const user = userEvent.setup();
      render(fixture(message));

      // select account
      const account = mockMnemonicAccount(1);
      const input = screen.getByLabelText("address");
      await act(() => user.type(input, account.address.pkh));

      // grant permission
      const grantButton = screen.getByRole("button", { name: "Sign" });
      expect(grantButton).toBeEnabled();
      await act(() => user.click(grantButton));

      expect(walletClient.respond).toHaveBeenCalledWith({
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
      render(fixture(message));

      // select account
      const account = mockMnemonicAccount(1);
      const input = screen.getByLabelText("address");

      await act(() => user.type(input, account.address.pkh));

      // grant permission
      const grantButton = screen.getByRole("button", { name: "Sign" });
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

  it("displays an error on unhandled Beacon request", () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;

    render(fixture(message));

    expect(screen.getByText("Unsupported request: blockchain_request")).toBeInTheDocument();
  });
});
