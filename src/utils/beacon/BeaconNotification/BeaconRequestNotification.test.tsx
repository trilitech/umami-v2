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
import {
  mockBeaconDelegate,
  objectOperationBatchRequest,
  objectOperationDelegationRequest,
  objectOperationRequest,
} from "../../../mocks/beacon";
import { mockImplicitAccount } from "../../../mocks/factories";
import { dispatchMockAccounts, fillPassword, mockEstimatedFee } from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../../mocks/testUtils";
import { walletClient } from "../beacon";
import { makeTransfer } from "../../../components/sendForm/util/execution";

jest.mock("../beacon");
jest.mock("../../../components/sendForm/util/execution");
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
    <BeaconNotification message={message} onSuccess={() => {}} />
  </Modal>
);

beforeEach(() => {
  mockEstimatedFee(10);
  jest.mocked(makeTransfer).mockResolvedValue({ hash: BATCH_OP_HASH.opHash });
  dispatchMockAccounts([mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)]);
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

  describe("Operation request (case simple tez transaction)", () => {
    const message: OperationRequestOutput = {
      ...objectOperationRequest,
      sourceAddress: mockImplicitAccount(2).address.pkh,
    };

    it("should display operations request with parameters displayed", async () => {
      render(fixture(message, () => {}));
      expect(screen.getByRole("dialog", { name: "Send" })).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /preview/i })).toBeEnabled();
      });
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
        expect(screen.getByRole("dialog", { name: "Recap" })).toBeInTheDocument();
      });

      fillPassword("mockPass");
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /submit transaction/i })).toBeEnabled();
      });
      screen.getByRole("button", { name: /submit transaction/i }).click();

      await waitFor(() => {
        expect(screen.getByText(/operation submitted/i)).toBeInTheDocument();
      });

      expect(walletClient.respond).toHaveBeenCalledWith({
        id: objectOperationRequest.id,
        transactionHash: BATCH_OP_HASH.opHash,
        type: "operation_response",
      });
    });
  });

  describe("Operation request (case delegation)", () => {
    const message: OperationRequestOutput = {
      ...objectOperationDelegationRequest,
      sourceAddress: mockImplicitAccount(2).address.pkh,
    };

    it("should display delegation request", async () => {
      render(fixture(message, () => {}));
      expect(screen.getByRole("dialog", { name: /delegation/i })).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /preview/i })).toBeEnabled();
      });
      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-baker")).toHaveAttribute(
          "value",
          mockBeaconDelegate
        );
      });
    });

    test("User previews then submits Delegation, and operation hash is sent via Beacon", async () => {
      render(fixture(message, () => {}));
      expect(screen.getByRole("dialog", { name: /delegation/i })).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /preview/i })).toBeEnabled();
      });
      screen.getByRole("button", { name: /preview/i }).click();
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "Recap" })).toBeInTheDocument();
      });

      fillPassword("mockPass");
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /submit transaction/i })).toBeEnabled();
      });
      screen.getByRole("button", { name: /submit transaction/i }).click();

      await waitFor(() => {
        expect(screen.getByText(/operation submitted/i)).toBeInTheDocument();
      });

      expect(walletClient.respond).toHaveBeenCalledWith({
        id: objectOperationDelegationRequest.id,
        transactionHash: BATCH_OP_HASH.opHash,
        type: "operation_response",
      });
    });
  });

  test("User previews then submits Batches, and operation hash is sent via Beacon", async () => {
    const message: OperationRequestOutput = {
      ...objectOperationBatchRequest,
      sourceAddress: mockImplicitAccount(2).address.pkh,
    };
    render(fixture(message, () => {}));
    const modal = screen.getByRole("dialog", { name: /recap/i });
    const { getByRole, getByLabelText } = within(modal);
    await waitFor(() => {
      expect(getByRole("button", { name: /preview/i })).toBeEnabled();
    });

    expect(screen.getByText(/transaction details/i)).toBeInTheDocument();

    const txsAmount = getByLabelText(/transactions-amount/i);
    expect(txsAmount).toHaveTextContent("3");

    const previewBtn = screen.getByRole("button", { name: /preview/i });
    fireEvent.click(previewBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
    fillPassword("mockPass");

    const submit = screen.getByRole("button", {
      name: /submit transaction/i,
    });

    await waitFor(() => {
      expect(submit).toBeEnabled();
    });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://mainnet.tzkt.io/bar");

    expect(walletClient.respond).toHaveBeenCalledWith({
      id: objectOperationBatchRequest.id,
      transactionHash: BATCH_OP_HASH.opHash,
      type: "operation_response",
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
