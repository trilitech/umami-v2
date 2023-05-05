import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  OperationRequestOutput,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";
import { BeaconNotification } from ".";
import { objectOperationRequest } from "../../../mocks/beacon";
import { mockAccount } from "../../../mocks/factories";
import {
  dispatchMockAccounts,
  fillAccountSelector,
  fillPassword,
  resetAccounts,
} from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { estimateTezTransfer, transferTez } from "../../tezos";
import { walletClient } from "../beacon";

jest.mock("../../tezos");
jest.mock("../beacon");
jest.mock("../../hooks/accountUtils", () => ({
  useGetSk: () => () => "mockSk",
}));

const SENDER_ID = "mockSenderId";
const DAPP_NAME = "mockDappName";
const MESSAGE_ID = "mockMessageId";
const SCOPES = [PermissionScope.SIGN];
const FEE = {
  suggestedFeeMutez: 12345,
};
const OP_HASH = { hash: "foo" };

const fixture = (
  message: BeaconRequestOutputMessage,
  onSuccess: () => void
) => (
  <Modal isOpen={true} onClose={() => {}}>
    <BeaconNotification message={message} onSuccess={() => {}} />
  </Modal>
);

const estimateTezTransferMock = estimateTezTransfer as jest.Mock;
const transferTezMock = transferTez as jest.Mock;

beforeEach(() => {
  estimateTezTransferMock.mockResolvedValue(FEE);
  transferTezMock.mockResolvedValue(OP_HASH);
});

beforeAll(() => {
  dispatchMockAccounts([mockAccount(1), mockAccount(2), mockAccount(3)]);
});

afterAll(() => {
  resetAccounts();
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

  describe("Operation request", () => {
    const message: OperationRequestOutput = {
      ...objectOperationRequest,
      sourceAddress: mockAccount(2).pkh,
    };
    it("should display operations request with controls disabled and parameter displayed", async () => {
      render(fixture(message, () => {}));
      expect(screen.getByRole("dialog", { name: "Send" })).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /preview/i })).toBeEnabled();
      });
      expect(screen.getByTestId("account-selector")).toBeDisabled();
      expect(screen.getByLabelText("recipient")).toBeDisabled();
      expect(screen.getByLabelText(/^amount$/i)).toBeDisabled();
      expect(screen.getByLabelText("Parameter")).toHaveTextContent(
        `{ "entrypoint": "fulfill_ask", "value": { "prim": "Pair", "args": [ { "int": "1232832" }, { "prim": "None" } ] } }`
      );
    });

    test("User previews then submits operation, and operation hash is sent via Beacon", async () => {
      render(fixture(message, () => {}));
      expect(screen.getByRole("dialog", { name: "Send" })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /preview/i })).toBeEnabled();
      });
      screen.getByRole("button", { name: /preview/i }).click();
      await waitFor(() => {
        expect(
          screen.getByRole("dialog", { name: "Recap" })
        ).toBeInTheDocument();
      });

      fillPassword("mockPass");
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /submit transaction/i })
        ).toBeEnabled();
      });
      screen.getByRole("button", { name: /submit transaction/i }).click();

      await waitFor(() => {
        expect(screen.getByText(/operation submitted/i)).toBeInTheDocument();
      });

      expect(walletClient.respond).toHaveBeenCalledWith({
        id: objectOperationRequest.id,
        transactionHash: "foo",
        type: "operation_response",
      });
    });
  });

  test("Unhandled Beacon request display an error", async () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;
    render(fixture(message, () => {}));
    expect(
      screen.getByText("Unsupported request: blockchain_request")
    ).toBeInTheDocument();
  });
});
