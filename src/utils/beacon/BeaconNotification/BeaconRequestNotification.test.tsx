import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";
import { BeaconNotification } from ".";
import { mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { dispatchMockAccounts, mockEstimatedFee } from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { walletClient } from "../beacon";
import { executeOperations } from "../../tezos";

jest.mock("../beacon");
jest.mock("../../tezos");
jest.mock("../../hooks/accountUtils", () => ({
  useGetSecretKey: () => () => "mockSk",
}));

const SENDER_ID = "mockSenderId";
const DAPP_NAME = "mockDappName";
const MESSAGE_ID = "mockMessageId";
const SCOPES = [PermissionScope.SIGN];
const BATCH_OP_HASH = { opHash: "bar" };

const fixture = (message: BeaconRequestOutputMessage, onSuccess: () => void) => (
  <Modal isOpen={true} onClose={() => {}}>
    <BeaconNotification message={message} onClose={() => {}} />
  </Modal>
);

beforeEach(() => {
  mockEstimatedFee(10);
  jest.mocked(executeOperations).mockResolvedValue({ opHash: BATCH_OP_HASH.opHash });
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2), mockMnemonicAccount(3)]);
});

describe("<BeaconRequestNotification />", () => {
  describe("Permission request", () => {
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
      render(fixture(message, () => {}));
      expect(screen.getByText(/Permission request/i)).toBeInTheDocument();
    });

    test("User can select account and grant permission", async () => {
      render(fixture(message, () => {}));
      // TODO: fix act warnings and uncomment
      // await waitFor(() => {
      //   selectAccount(mockImplicitAccount(2).label, "Select Account");
      // });
      const grantButton = screen.getByRole("button", { name: /grant/i });
      expect(grantButton).toBeEnabled();

      fireEvent.click(grantButton);
      await waitFor(() => {
        expect(walletClient.respond).toHaveBeenCalledWith({
          id: MESSAGE_ID,
          network: { type: "mainnet" },
          publicKey: mockImplicitAccount(1).pk,
          scopes: SCOPES,
          type: "permission_response",
        });
      });
    });
  });

  test("Unhandled Beacon request display an error", async () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;
    render(fixture(message, () => {}));
    expect(screen.getByText("Unsupported request: blockchain_request")).toBeInTheDocument();
  });
});
