import { BeaconMessageType, NetworkType, type OperationRequestOutput } from "@airgap/beacon-wallet";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { executeOperations, mockImplicitAccount, mockTezOperation } from "@umami/core";
import { networksActions, store } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { GHOSTNET, MAINNET, makeToolkit } from "@umami/tezos";

import { TezSignPage } from "./TezSignPage";
import {
  act,
  dynamicModalContextMock,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { WalletClient } from "../../../utils/beacon/WalletClient";
import { useGetSecretKey } from "../../../utils/hooks/getAccountDataHooks";
import { SuccessStep } from "../SuccessStep";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  executeOperations: jest.fn(),
  makeToolkit: jest.fn(),
}));

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
}));

jest.mock("../../../utils/hooks/getAccountDataHooks", () => ({
  ...jest.requireActual("../../../utils/hooks/getAccountDataHooks"),
  useGetSecretKey: jest.fn(),
}));

describe("<TezSignPage />", () => {
  it("uses correct network", async () => {
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
    store.dispatch(networksActions.setCurrent(MAINNET));
    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));

    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    render(<TezSignPage message={message} operation={operation} />);

    expect(screen.getByText("Ghostnet")).toBeVisible();
    expect(screen.queryByText("Mainnet")).not.toBeInTheDocument();

    await act(() => user.type(screen.getByLabelText("Password"), "Password"));

    const signButton = screen.getByRole("button", {
      name: "Confirm Transaction",
    });
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
  });
});
