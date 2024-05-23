import { BeaconMessageType, NetworkType, OperationRequestOutput } from "@airgap/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import BigNumber from "bignumber.js";

import { OriginationOperationSignPage } from "./OriginationOperationSignPage";
import { mockContractOrigination, mockImplicitAccount } from "../../../mocks/factories";
import {
  act,
  dynamicModalContextMock,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { GHOSTNET } from "../../../types/Network";
import { WalletClient } from "../../../utils/beacon/WalletClient";
import { prettyTezAmount } from "../../../utils/format";
import { useGetSecretKey } from "../../../utils/hooks/getAccountDataHooks";
import { executeOperations, makeToolkit } from "../../../utils/tezos";
import { SuccessStep } from "../SuccessStep";

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
  operations: [mockContractOrigination(0)],
};
const fee = BigNumber(123);

jest.mock("../../../utils/tezos", () => ({
  ...jest.requireActual("../../../utils/tezos"),
  executeOperations: jest.fn(),
  makeToolkit: jest.fn(),
}));

jest.mock("../../../utils/hooks/getAccountDataHooks", () => ({
  ...jest.requireActual("../../../utils/hooks/getAccountDataHooks"),
  useGetSecretKey: jest.fn(),
}));

describe("<OriginationOperationSignPage />", () => {
  it("renders fee", () => {
    render(<OriginationOperationSignPage fee={fee} message={message} operation={operation} />);

    expect(screen.getByText(prettyTezAmount(fee))).toBeVisible();
  });

  it("passes correct payload to sign handler", async () => {
    const user = userEvent.setup();
    const testToolkit = new TezosToolkit("test-tezos-toolkit");

    jest.mocked(makeToolkit).mockImplementation(() => Promise.resolve(testToolkit));
    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));
    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    render(<OriginationOperationSignPage fee={fee} message={message} operation={operation} />);

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
    expect(executeOperations).toHaveBeenCalledWith(operation, testToolkit);

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
