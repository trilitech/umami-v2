import { BeaconMessageType, NetworkType, type OperationRequestOutput } from "@airgap/beacon-wallet";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import {
  type EstimatedAccountOperations,
  type Operation,
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
import { SingleSignPage } from "./SingleSignPage";
import { Titles } from "../../Titles/Titles";

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

describe("<SingleSignPage />", () => {
  const store = makeStore();
  const user = userEvent.setup();

  const message = {
    id: "messageid",
    type: BeaconMessageType.OperationRequest,
    network: { type: NetworkType.GHOSTNET },
    appMetadata: { name: "mockDappName", icon: "mockIcon" },
  } as OperationRequestOutput;

  const mockedOperations: Record<string, Operation> = {
    TezSignPage: mockTezOperation(0),
    ContractCallSignPage: mockContractCall(0),
    DelegationSignPage: mockDelegationOperation(0),
    UndelegationSignPage: mockUndelegationOperation(0),
    OriginationOperationSignPage: mockContractOrigination(0),
    StakeSignPage: mockStakeOperation(0),
    UnstakeSignPage: mockUnstakeOperation(0),
    FinalizeUnstakeSignPage: mockFinalizeUnstakeOperation(0),
  };

  const titles: Record<string, string> = {
    TezSignPage: Titles.TezSignPage,
    ContractCallSignPage: Titles.ContractCallSignPage,
    DelegationSignPage: Titles.DelegationSignPage,
    UndelegationSignPage: Titles.UndelegationSignPage,
    OriginationOperationSignPage: Titles.OriginationOperationSignPage,
    StakeSignPage: Titles.StakeSignPage,
    UnstakeSignPage: Titles.UnstakeSignPage,
    FinalizeUnstakeSignPage: Titles.FinalizeUnstakeSignPage,
  };

  const operation: EstimatedAccountOperations = {
    type: "implicit" as const,
    sender: mockImplicitAccount(0),
    signer: mockImplicitAccount(0),
    operations: [],
    estimates: [executeParams({ fee: 123 })],
  };

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
    expect(screen.getByTestId(key)).toBeInTheDocument(); // e.g. TezSignPage

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent(titles[key]);
    expect(screen.getByTestId("app-name")).toHaveTextContent("mockDappName");

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
      expect(useValidateWcRequest).toHaveBeenCalledTimes(1);
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
  });

  it("WalletConnect: handles valid operation and responds", async () => {
    for (const key in mockedOperations) {
      jest.mocked(useValidateWcRequest).mockImplementation(() => () => true);
      await testOperation(key, "walletconnect");
      jest.mocked(useValidateWcRequest).mockClear();
    }
  });
});
