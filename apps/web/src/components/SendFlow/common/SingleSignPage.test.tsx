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
import { WalletClient, makeStore, networksActions, useGetSecretKey } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { GHOSTNET, makeToolkit } from "@umami/tezos";

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
}));

describe("<SingleSignPage />", () => {
  it("calls the correct modal", async () => {
    const store = makeStore();
    const user = userEvent.setup();

    const message = {
      id: "messageid",
      type: BeaconMessageType.OperationRequest,
      network: { type: NetworkType.GHOSTNET },
      appMetadata: {},
    } as OperationRequestOutput;

    // check all types of Modals called by SingleSignOperation
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

    const operation: EstimatedAccountOperations = {
      type: "implicit" as const,
      sender: mockImplicitAccount(0),
      signer: mockImplicitAccount(0),
      operations: [],
      estimates: [executeParams({ fee: 123 })],
    };
    const headerProps: SignHeaderProps = {
      network: GHOSTNET,
      appName: message.appMetadata.name,
      appIcon: message.appMetadata.icon,
    };
    store.dispatch(networksActions.setCurrent(GHOSTNET));

    for (const key in mockedOperations) {
      operation.operations = [mockedOperations[key]];
      const signProps: SdkSignPageProps = {
        headerProps: headerProps,
        operation: operation,
        requestId: { sdkType: "beacon", id: message.id },
      };

      jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));

      jest
        .mocked(executeOperations)
        .mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
      jest.spyOn(WalletClient, "respond").mockResolvedValue();

      await renderInModal(<SingleSignPage {...signProps} />, store);

      expect(screen.getByText("Ghostnet")).toBeInTheDocument();
      expect(screen.queryByText("Mainnet")).not.toBeInTheDocument();
      expect(screen.getByTestId(key)).toBeInTheDocument(); // e.g. TezSignPage

      const signButton = screen.getByRole("button", {
        name: "Confirm Transaction",
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
      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(<SuccessStep hash="ophash" />);
      dynamicModalContextMock.openWith.mockClear();
    }
  });
});
