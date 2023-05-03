import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";
import { mockAccount } from "../../../mocks/factories";
import {
  dispatchMockAccounts,
  fillAccountSelector,
  resetAccounts,
} from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { walletClient } from "../beacon";
import { BeaconNotification } from ".";

const SENDER_ID = "mockSenderId";
const DAPP_NAME = "mockDappName";
const MESSAGE_ID = "mockMessageId";
const SCOPES = [PermissionScope.SIGN];

jest.mock("../beacon");

const fixture = (
  message: BeaconRequestOutputMessage,
  onSuccess: () => void
) => (
  <Modal isOpen={true} onClose={() => {}}>
    <BeaconNotification message={message} onSuccess={() => {}} />
  </Modal>
);

beforeAll(() => {
  dispatchMockAccounts([mockAccount(1), mockAccount(2), mockAccount(3)]);
});

afterAll(() => {
  resetAccounts();
});

describe("<BeaconNotification />", () => {
  describe("Permission", () => {
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
      fillAccountSelector(mockAccount(2).label || "");
      const grantButton = screen.getByRole("button", { name: /grant/i });
      expect(grantButton).toBeEnabled();

      fireEvent.click(grantButton);
      await waitFor(() => {
        expect(walletClient.respond).toHaveBeenCalledWith({
          id: MESSAGE_ID,
          network: { type: "mainnet" },
          publicKey: mockAccount(2).pk,
          scopes: SCOPES,
          type: "permission_response",
        });
      });
    });
  });
});
