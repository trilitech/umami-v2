import { BeaconMessageType, NetworkType, type OperationRequestOutput } from "@airgap/beacon-wallet";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import {
  type EstimatedAccountOperations,
  Hints,
  type Operation,
  type SignPage,
  Titles,
  executeOperations,
  mockContractCall,
  mockContractOrigination,
  mockDelegationOperation,
  mockFinalizeUnstakeOperation,
  mockImplicitAccount,
  mockStakeOperation,
  mockTezOperation,
  mockUndelegationOperation,
  mockUnstakeOperation,
} from "@umami/core";
import {
  WalletClient,
  makeStore,
  networksActions,
  useGetSecretKey,
  useValidateWcRequest,
  walletKit,
} from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { GHOSTNET, makeToolkit } from "@umami/tezos";
import { type JsonRpcResult } from "@walletconnect/jsonrpc-utils";

import {
  act,
  dynamicModalContextMock,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../../testUtils";
import { SuccessStep } from "../SuccessStep";
import { type SdkSignPageProps, type SignHeaderProps } from "../utils";
import { SingleSignPage } from "./RequestSignPage";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  executeOperations: jest.fn(),
  makeToolkit: jest.fn(),
}));

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetSecretKey: jest.fn(),
  useValidateWcRequest: jest.fn(),
  walletKit: {
    core: {},
    metadata: {
      name: "AppMenu test",
      description: "Umami Wallet with WalletConnect",
      url: "https://umamiwallet.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
    respondSessionRequest: jest.fn(),
  },
  createWalletKit: jest.fn(),
}));

// check all types of Modals called by SingleSignOperation
const mockedOperations: Record<SignPage, Operation> = {
  tez: mockTezOperation(0),
  contract_call: mockContractCall(0),
  delegation: mockDelegationOperation(0),
  undelegation: mockUndelegationOperation(0),
  contract_origination: mockContractOrigination(0),
  stake: mockStakeOperation(0),
  unstake: mockUnstakeOperation(0),
  finalize_unstake: mockFinalizeUnstakeOperation(0),
};

const operation: EstimatedAccountOperations = {
  type: "implicit" as const,
  sender: mockImplicitAccount(0),
  signer: mockImplicitAccount(0),
  operations: [],
  estimates: [executeParams({ fee: 123 })],
};

describe("<SingleSignPage />", () => {
  const store = makeStore();
  const user = userEvent.setup();

  const message = {
    id: "messageid",
    type: BeaconMessageType.OperationRequest,
    network: { type: NetworkType.GHOSTNET },
    appMetadata: { name: "mockDappName", icon: "mockIcon" },
  } as OperationRequestOutput;

  beforeEach(() => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));
    jest.spyOn(walletKit, "respondSessionRequest");
  });

  const testOperation = async (key: string, sdkType: "beacon" | "walletconnect") => {
    operation.operations = [mockedOperations[key]];
    const headerProps: SignHeaderProps = {
      network: GHOSTNET,
      appName: message.appMetadata.name,
      appIcon: message.appMetadata.icon,
      requestId:
        sdkType === "beacon"
          ? { sdkType, id: message.id }
          : { sdkType, id: 123, topic: "mockTopic" },
    };
    const signProps: SdkSignPageProps = {
      headerProps,
      operation,
    };

    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));

    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);

    await renderInModal(<SingleSignPage {...signProps} />, store);

    expect(screen.getByText("Ghostnet")).toBeInTheDocument();
    expect(screen.queryByText("Mainnet")).not.toBeInTheDocument();
    expect(screen.getByTestId(key)).toBeInTheDocument(); // e.g. tez

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent(Titles[key]);
    expect(screen.getByTestId("app-name")).toHaveTextContent("mockDappName");
    if (key in Hints && Hints[key].header && Hints[key].description) {
      expect(screen.getByTestId("hints-accordion")).toHaveTextContent(Hints[key].header);
      expect(screen.getByTestId("hints-accordion")).toHaveTextContent(Hints[key].description);
    } else {
      expect(screen.queryByTestId("hints-accordion")).not.toBeInTheDocument();
    }

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent(Titles[key]);
    expect(screen.getByTestId("app-name")).toHaveTextContent("mockDappName");
    if (key in Hints && Hints[key].header && Hints[key].description) {
      expect(screen.getByTestId("hints-accordion")).toHaveTextContent(Hints[key].header);
      expect(screen.getByTestId("hints-accordion")).toHaveTextContent(Hints[key].description);
    } else {
      expect(screen.queryByTestId("hints-accordion")).not.toBeInTheDocument();
    }
    const signButton = screen.getByRole("button", { name: "Confirm transaction" });
    await waitFor(() => expect(signButton).toBeDisabled());

    await act(() => user.type(screen.getByLabelText("Password"), "ThisIsAPassword"));

    await waitFor(() => expect(signButton).toBeEnabled());

    await act(() => user.click(signButton));

    expect(makeToolkit).toHaveBeenCalledWith({
      type: "mnemonic",
      secretKey: "secretKey",
      network: GHOSTNET,
    });

    if (sdkType === "beacon") {
      await waitFor(() =>
        expect(WalletClient.respond).toHaveBeenCalledWith({
          type: BeaconMessageType.OperationResponse,
          id: message.id,
          transactionHash: "ophash",
        })
      );
    } else {
      const response: JsonRpcResult = {
        id: 123,
        jsonrpc: "2.0",
        result: {
          hash: "ophash",
          operationHash: "ophash",
        },
      } as unknown as JsonRpcResult;

      await waitFor(() =>
        expect(walletKit.respondSessionRequest).toHaveBeenCalledWith({
          topic: "mockTopic",
          response,
        })
      );
    }

    expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(<SuccessStep hash="ophash" />, {
      canBeOverridden: true,
    });
    dynamicModalContextMock.openWith.mockClear();
  };

  it("Beacon: handles operation and responds", async () => {
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    for (const key in mockedOperations) {
      await testOperation(key, "beacon");
    }
  }, 10000);

  it("WalletConnect: handles valid operation and responds", async () => {
    for (const key in mockedOperations) {
      jest.mocked(useValidateWcRequest).mockImplementation(() => () => true);
      await testOperation(key, "walletconnect");
      jest.mocked(useValidateWcRequest).mockClear();
    }
  }, 10000);
});

describe("batch handling", () => {
  it("calls the correct modal", async () => {
    const store = makeStore();
    const user = userEvent.setup();

    const message = {
      id: "messageid",
      type: BeaconMessageType.OperationRequest,
      network: { type: NetworkType.GHOSTNET },
      appMetadata: { name: "mockDappName", icon: "mockIcon" },
    } as OperationRequestOutput;

    operation.operations = [mockedOperations["tez"], mockedOperations["contract_call"]];

    const headerProps: SignHeaderProps = {
      network: GHOSTNET,
      appName: message.appMetadata.name,
      appIcon: message.appMetadata.icon,
      requestId: { sdkType: "beacon", id: message.id },
    };
    store.dispatch(networksActions.setCurrent(GHOSTNET));

    const signProps: SdkSignPageProps = {
      headerProps: headerProps,
      operation: operation,
    };

    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));

    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    await renderInModal(<SingleSignPage {...signProps} />, store);

    expect(screen.getByText("Ghostnet")).toBeInTheDocument();
    expect(screen.queryByText("Mainnet")).not.toBeInTheDocument();
    expect(screen.getByTestId("batch")).toBeInTheDocument();

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent(Titles["batch"]);
    expect(screen.getByTestId("app-name")).toHaveTextContent("mockDappName");

    const signButton = screen.getByRole("button", {
      name: "Confirm transaction",
    });
    await waitFor(() => expect(signButton).toBeDisabled());

    await act(() => user.type(screen.getByLabelText("Password"), "ThisIsAPassword"));

    await waitFor(() => expect(signButton).toBeEnabled());
    await act(() => user.click(signButton));

    expect(makeToolkit).toHaveBeenCalledWith({
      type: "mnemonic",
      secretKey: "secretKey",
      network: GHOSTNET,
    });

    await waitFor(() =>
      expect(WalletClient.respond).toHaveBeenCalledWith({
        type: BeaconMessageType.OperationResponse,
        id: message.id,
        transactionHash: "ophash",
      })
    );
    expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(<SuccessStep hash="ophash" />, {
      canBeOverridden: true,
    });
    dynamicModalContextMock.openWith.mockClear();
  });
});
