import { BeaconMessageType, NetworkType, type OperationRequestOutput } from "@airgap/beacon-wallet";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { executeOperations, mockImplicitAccount, mockTezOperation } from "@umami/core";
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

describe("<TezSignPage />", () => {
  it("uses correct network", async () => {
    const store = makeStore();

    const user = userEvent.setup();
    const message = {
      id: "messageid",
      type: BeaconMessageType.OperationRequest,
      network: { type: NetworkType.GHOSTNET },
      appMetadata: {},
    } as OperationRequestOutput;
    const operation = {
      type: "implicit" as const,
      sender: mockImplicitAccount(0),
      signer: mockImplicitAccount(0),
      operations: [mockTezOperation(0)],
      estimates: [executeParams({ fee: 123 })],
    };
    const headerProps: SignHeaderProps = {
      network: GHOSTNET,
      appName: message.appMetadata.name,
      appIcon: message.appMetadata.icon,
      requestId: { sdkType: "beacon", id: message.id },
    };
    const signProps: SdkSignPageProps = {
      headerProps: headerProps,
      operation: operation,
    };

    store.dispatch(networksActions.setCurrent(GHOSTNET));
    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));

    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    await renderInModal(<SingleSignPage {...signProps} />, store);

    expect(screen.getByText("Ghostnet")).toBeInTheDocument();
    expect(screen.queryByText("Mainnet")).not.toBeInTheDocument();

    expect(screen.queryByText("verifyinfobox")).not.toBeInTheDocument();

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
  });
});
