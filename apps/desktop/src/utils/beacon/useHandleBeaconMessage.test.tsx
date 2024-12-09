import {
  BeaconMessageType,
  type BeaconRequestOutputMessage,
  NetworkType,
  type PermissionRequestOutput,
  PermissionScope,
  type SignPayloadRequestOutput,
  SigningType,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { estimate, makeAccountOperations, mockImplicitAccount } from "@umami/core";
import { type UmamiStore, WalletClient, addTestAccount, makeStore, mockToast } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { mockImplicitAddress } from "@umami/tezos";
import { CustomError } from "@umami/utils";

import { useHandleBeaconMessage } from "./useHandleBeaconMessage";
import { BatchSignPage } from "../../components/SendFlow/Beacon/BatchSignPage";
import { BeaconSignPage } from "../../components/SendFlow/Beacon/BeaconSignPage";
import { act, dynamicModalContextMock, renderHook, screen, waitFor } from "../../mocks/testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

jest.spyOn(WalletClient, "respond");

const SENDER_ID = "mockSenderId";

const account = mockImplicitAccount(1);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
});

describe("<useHandleBeaconMessage />", () => {
  describe("permission request", () => {
    it("opens a PermissionRequestModal", async () => {
      const message: PermissionRequestOutput = {
        appMetadata: { name: "mockDappName", senderId: SENDER_ID },
        id: "mockMessageId",
        network: { type: NetworkType.MAINNET },
        scopes: [PermissionScope.SIGN],
        senderId: SENDER_ID,
        type: BeaconMessageType.PermissionRequest,
        version: "2",
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await screen.findByText("Permission Request");
    });

    it("sends an error response to the dapp on close", async () => {
      const message: PermissionRequestOutput = {
        appMetadata: { name: "mockDappName", senderId: SENDER_ID },
        id: "mockMessageId",
        network: { type: NetworkType.MAINNET },
        scopes: [PermissionScope.SIGN],
        senderId: SENDER_ID,
        type: BeaconMessageType.PermissionRequest,
        version: "2",
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await screen.findByText("Permission Request");

      act(() => screen.getByRole("button", { name: "Close" }).click());

      expect(WalletClient.respond).toHaveBeenCalledWith({
        errorType: "NOT_GRANTED_ERROR",
        id: "mockMessageId",
        type: "error",
      });
    });
  });

  describe("sign payload request", () => {
    it("opens a SignPayloadRequestModal", async () => {
      const message: SignPayloadRequestOutput = {
        payload: "mockPayload",
        sourceAddress: account.address.pkh,
        appMetadata: { name: "mockDappName", senderId: SENDER_ID },
        id: "mockMessageId",
        signingType: SigningType.RAW,
        senderId: SENDER_ID,
        type: BeaconMessageType.SignPayloadRequest,
        version: "2",
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await screen.findByText("mockDappName/dApp Pairing Request");
    });

    it("sends an error response to the dapp on close", async () => {
      const message: SignPayloadRequestOutput = {
        payload: "mockPayload",
        sourceAddress: account.address.pkh,
        appMetadata: { name: "mockDappName", senderId: SENDER_ID },
        id: "mockMessageId",
        signingType: SigningType.RAW,
        senderId: SENDER_ID,
        type: BeaconMessageType.SignPayloadRequest,
        version: "2",
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await screen.findByText("mockDappName/dApp Pairing Request");

      act(() => screen.getByRole("button", { name: "Close" }).click());

      expect(WalletClient.respond).toHaveBeenCalledWith({
        errorType: "ABORTED_ERROR",
        id: "mockMessageId",
        type: "error",
      });
    });
  });

  it("displays an error on an unknown Beacon request", async () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;

    const {
      result: { current: handleMessage },
    } = renderHook(() => useHandleBeaconMessage(), { store });

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Error while processing Beacon request: Unknown Beacon message type: blockchain_request",
        status: "error",
        isClosable: true,
      })
    );
    expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
  });

  describe("operation request", () => {
    it("doesn't open a modal on an empty operation details", async () => {
      const message = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [],
        sourceAddress: account.address.pkh,
        network: { type: NetworkType.MAINNET },
      } as unknown as BeaconRequestOutputMessage;

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description: "Error while processing Beacon request: Empty operation details!",
          status: "error",
          isClosable: true,
        })
      );
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });

    it("doesn't open a modal on an unknown operation type", async () => {
      const message = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [{ kind: TezosOperationType.ACTIVATE_ACCOUNT }],
        sourceAddress: account.address.pkh,
        network: { type: NetworkType.MAINNET },
      } as unknown as BeaconRequestOutputMessage;

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description:
            "Error while processing Beacon request: Unsupported operation kind: activate_account",
          status: "error",
          isClosable: true,
        })
      );
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });

    it("doesn't open a modal when account is not owned", async () => {
      const message: BeaconRequestOutputMessage = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [
          {
            kind: TezosOperationType.TRANSACTION,
            amount: "1",
            destination: mockImplicitAddress(2).pkh,
          },
        ],
        senderId: "mockSenderId",
        id: "mockMessageId",
        network: { type: NetworkType.MAINNET },
        appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
        sourceAddress: mockImplicitAddress(3).pkh,
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description:
            "Error while processing Beacon request: Unknown account: tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
          status: "error",
          isClosable: true,
        })
      );
      expect(WalletClient.respond).toHaveBeenCalledWith({
        errorType: "NO_PRIVATE_KEY_FOUND_ERROR",
        id: "mockMessageId",
        type: "error",
      });
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });

    it("doesn't open a modal on an error while estimating the fee", async () => {
      jest.mocked(estimate).mockRejectedValueOnce(new CustomError("Something went very wrong!"));

      const message: BeaconRequestOutputMessage = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [
          {
            kind: TezosOperationType.TRANSACTION,
            amount: "1",
            destination: mockImplicitAddress(2).pkh,
          },
        ],
        senderId: "mockSenderId",
        id: "mockMessageId",
        network: { type: NetworkType.MAINNET },
        appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
        sourceAddress: account.address.pkh,
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description: "Error while processing Beacon request: Something went very wrong!",
          status: "error",
          isClosable: true,
        })
      );
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });

    it("doesn't open a modal when the network is unknown", async () => {
      const message: BeaconRequestOutputMessage = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [],
        senderId: "mockSenderId",
        id: "mockMessageId",
        network: { type: "Whatever" as any },
        appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
        sourceAddress: account.address.pkh,
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description:
            'Error while processing Beacon request: Got Beacon request from an unknown network: {"type":"Whatever"}. Please add it to the networks list and retry.',
          status: "error",
          isClosable: true,
        });
      });

      expect(WalletClient.respond).toHaveBeenCalledWith({
        errorType: "NETWORK_NOT_SUPPORTED",
        id: "mockMessageId",
        type: "error",
      });
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });

    describe("single operation", () => {
      it("opens a modal with the BeaconSignPage for 1 operation", async () => {
        jest.mocked(estimate).mockResolvedValueOnce({
          ...makeAccountOperations(account, account, [
            { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
          ]),
          estimates: [executeParams()],
        });

        const message: BeaconRequestOutputMessage = {
          type: BeaconMessageType.OperationRequest,
          operationDetails: [
            {
              kind: TezosOperationType.TRANSACTION,
              amount: "1",
              destination: mockImplicitAddress(2).pkh,
            },
          ],
          senderId: "mockSenderId",
          id: "mockMessageId",
          network: { type: NetworkType.MAINNET },
          appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
          sourceAddress: account.address.pkh,
        };

        const {
          result: { current: handleMessage },
        } = renderHook(() => useHandleBeaconMessage(), { store });

        act(() => handleMessage(message));

        await waitFor(() =>
          expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
            <BeaconSignPage
              message={message}
              operation={{
                ...makeAccountOperations(account, account, [
                  { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
                ]),
                estimates: [executeParams()],
              }}
            />,
            { onClose: expect.any(Function) }
          )
        );
        expect(mockToast).not.toHaveBeenCalled();
      });

      it("sends an error response to the dapp on close", async () => {
        jest.mocked(estimate).mockResolvedValueOnce({
          ...makeAccountOperations(account, account, [
            { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
          ]),
          estimates: [executeParams()],
        });

        const message: BeaconRequestOutputMessage = {
          type: BeaconMessageType.OperationRequest,
          operationDetails: [
            {
              kind: TezosOperationType.TRANSACTION,
              amount: "1",
              destination: mockImplicitAddress(2).pkh,
            },
          ],
          senderId: "mockSenderId",
          id: "mockMessageId",
          network: { type: NetworkType.MAINNET },
          appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
          sourceAddress: account.address.pkh,
        };

        const {
          result: { current: handleMessage },
        } = renderHook(() => useHandleBeaconMessage(), { store });

        act(() => handleMessage(message));

        await waitFor(() => expect(dynamicModalContextMock.openWith).toHaveBeenCalledTimes(1));

        act(() => screen.getByRole("button", { name: "Close" }).click());

        expect(WalletClient.respond).toHaveBeenCalledWith({
          errorType: "ABORTED_ERROR",
          id: "mockMessageId",
          type: "error",
        });
      });
    });

    describe("batch operation", () => {
      it("opens a modal with the BatchSignPage for multiple operations", async () => {
        jest.mocked(estimate).mockResolvedValueOnce({
          ...makeAccountOperations(account, account, [
            { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
            { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
          ]),
          estimates: [executeParams()],
        });

        const message: BeaconRequestOutputMessage = {
          type: BeaconMessageType.OperationRequest,
          operationDetails: [
            {
              kind: TezosOperationType.TRANSACTION,
              amount: "1",
              destination: mockImplicitAddress(2).pkh,
            },
            {
              kind: TezosOperationType.TRANSACTION,
              amount: "1",
              destination: mockImplicitAddress(2).pkh,
            },
          ],
          senderId: "mockSenderId",
          id: "mockMessageId",
          network: { type: NetworkType.MAINNET },
          appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
          sourceAddress: account.address.pkh,
        };

        const {
          result: { current: handleMessage },
        } = renderHook(() => useHandleBeaconMessage(), { store });

        act(() => handleMessage(message));

        await waitFor(() =>
          expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
            <BatchSignPage
              message={message}
              operation={{
                ...makeAccountOperations(account, account, [
                  { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
                  { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
                ]),
                estimates: [executeParams()],
              }}
            />,
            { onClose: expect.any(Function) }
          )
        );
        expect(mockToast).not.toHaveBeenCalled();
      });
    });

    it("sends an error response to the dapp on close", async () => {
      jest.mocked(estimate).mockResolvedValueOnce({
        ...makeAccountOperations(account, account, [
          { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
        ]),
        estimates: [executeParams()],
      });

      const message: BeaconRequestOutputMessage = {
        type: BeaconMessageType.OperationRequest,
        operationDetails: [
          {
            kind: TezosOperationType.TRANSACTION,
            amount: "1",
            destination: mockImplicitAddress(2).pkh,
          },
        ],
        senderId: "mockSenderId",
        id: "mockMessageId",
        network: { type: NetworkType.MAINNET },
        appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
        sourceAddress: account.address.pkh,
      };

      const {
        result: { current: handleMessage },
      } = renderHook(() => useHandleBeaconMessage(), { store });

      act(() => handleMessage(message));

      await waitFor(() => expect(dynamicModalContextMock.openWith).toHaveBeenCalledTimes(1));

      act(() => screen.getByRole("button", { name: "Close" }).click());

      expect(WalletClient.respond).toHaveBeenCalledWith({
        errorType: "ABORTED_ERROR",
        id: "mockMessageId",
        type: "error",
      });
    });
  });
});
