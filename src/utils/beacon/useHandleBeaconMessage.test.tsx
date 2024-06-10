import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  PartialTezosOperation,
  PermissionRequestOutput,
  PermissionScope,
  SignPayloadRequestOutput,
  SigningType,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { without } from "lodash";

import {
  partialOperationToOperation,
  toAccountOperations,
  useHandleBeaconMessage,
} from "./useHandleBeaconMessage";
import { WalletClient } from "./WalletClient";
import { BatchSignPage } from "../../components/SendFlow/Beacon/BatchSignPage";
import { BeaconSignPage } from "../../components/SendFlow/Beacon/BeaconSignPage";
import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
  mockTezOperation,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { act, dynamicModalContextMock, renderHook, screen, waitFor } from "../../mocks/testUtils";
import { mockToast } from "../../mocks/toast";
import { ImplicitOperations, makeAccountOperations } from "../../types/AccountOperations";
import { estimate } from "../tezos";

jest.mock("./WalletClient", () => ({
  WalletClient: {
    getPeers: () => Promise.resolve([]),
    respond: jest.fn(),
  },
}));
jest.mock("../tezos");

jest.mock("../../components/AdvancedSettingsAccordion.tsx", () => ({
  AdvancedSettingsAccordion: () => <div>Test component</div>,
}));

const SENDER_ID = "mockSenderId";

const account = mockImplicitAccount(1);

beforeEach(() => addAccount(account));

describe("<useHandleBeaconMessage />", () => {
  test("permission request", async () => {
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await screen.findByText("Permission Request");
  });

  test("sign payload request", async () => {
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await screen.findByText("Connect with pairing request");
  });

  it("displays an error on an unknown Beacon request", async () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;

    const {
      result: { current: handleMessage },
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Error while processing Beacon request: Unknown Beacon message type: blockchain_request",
        status: "error",
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
      } = renderHook(useHandleBeaconMessage);

      act(() => handleMessage(message));

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith({
          description: "Error while processing Beacon request: Empty operation details!",
          status: "error",
        })
      );
      expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
    });
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Error while processing Beacon request: Unsupported operation kind: activate_account",
        status: "error",
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Error while processing Beacon request: Unknown account: tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        status: "error",
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
    jest.mocked(estimate).mockRejectedValueOnce(new Error("Something went very wrong!"));

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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description: "Error while processing Beacon request: Something went very wrong!",
        status: "error",
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description:
          'Error while processing Beacon request: Got Beacon request from an unknown network: {"type":"Whatever"}. Please add it to the networks list and retry.',
        status: "error",
      });
    });

    expect(WalletClient.respond).toHaveBeenCalledWith({
      errorType: "NETWORK_NOT_SUPPORTED",
      id: "mockMessageId",
      type: "error",
    });
    expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
  });

  it("opens a modal with the BeaconSignPage for 1 operation", async () => {
    jest.mocked(estimate).mockResolvedValueOnce({
      fee: 100,
      storageLimit: 0,
      gasLimit: 0,
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <BeaconSignPage
          executeParams={{
            fee: 100,
            storageLimit: 0,
            gasLimit: 0,
          }}
          message={message}
          operation={
            makeAccountOperations(account, account, [
              { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
            ]) as ImplicitOperations
          }
        />
      )
    );
    expect(mockToast).not.toHaveBeenCalled();
  });

  it("opens a modal with the BatchSignPage for multiple operations", async () => {
    jest.mocked(estimate).mockResolvedValueOnce({
      fee: 100,
      storageLimit: 0,
      gasLimit: 0,
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
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <BatchSignPage
          executeParams={{
            fee: 100,
            storageLimit: 0,
            gasLimit: 0,
          }}
          message={message}
          operation={
            makeAccountOperations(account, account, [
              { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
              { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
            ]) as ImplicitOperations
          }
        />
      )
    );
    expect(mockToast).not.toHaveBeenCalled();
  });
});

describe("toAccountOperations", () => {
  it("throws if the list is empty", () => {
    expect(() => toAccountOperations([], account)).toThrow("Empty operation details!");
  });

  it("converts a list of partial operations to ImplicitOperations", () => {
    const operationDetails: PartialTezosOperation[] = [
      {
        kind: TezosOperationType.TRANSACTION,
        amount: "1",
        destination: mockImplicitAddress(2).pkh,
      },
      {
        kind: TezosOperationType.TRANSACTION,
        amount: "2",
        destination: mockImplicitAddress(2).pkh,
      },
    ];

    const operations = toAccountOperations(operationDetails, account);

    expect(operations).toEqual(
      makeAccountOperations(account, account, [
        { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
        { type: "tez", amount: "2", recipient: mockImplicitAddress(2) },
      ])
    );
  });
});

describe("partialOperationToOperation", () => {
  describe.each(
    without(
      Object.values(TezosOperationType),
      TezosOperationType.TRANSACTION,
      TezosOperationType.DELEGATION,
      TezosOperationType.ORIGINATION
    )
  )("for %s", kind => {
    it("throws an error", () => {
      const operation: PartialTezosOperation = { kind } as PartialTezosOperation;

      expect(() => partialOperationToOperation(operation, account)).toThrow(
        `Unsupported operation kind: ${kind}`
      );
    });
  });

  test("tez transaction", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "1",
      destination: mockImplicitAddress(2).pkh,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual(mockTezOperation(1));
  });

  test("contract call", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "1",
      destination: mockContractAddress(2).pkh,
      parameters: {
        entrypoint: "mockEntrypoint",
        value: [{ prim: "UNIT" }],
      },
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "contract_call",
      amount: "1",
      contract: mockContractAddress(2),
      entrypoint: "mockEntrypoint",
      args: [{ prim: "UNIT" }],
    });
  });

  test("delegate", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.DELEGATION,
      delegate: mockImplicitAddress(2).pkh,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "delegation",
      sender: account.address,
      recipient: mockImplicitAddress(2),
    });
  });

  test("undelegate", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.DELEGATION,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({ type: "undelegation", sender: account.address });
  });
});
