import { BeaconMessageType, NetworkType, type OperationRequestOutput } from "@airgap/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { executeOperations, mockContractOrigination, mockImplicitAccount } from "@umami/core";
import { WalletClient, useGetSecretKey } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { GHOSTNET, makeToolkit, prettyTezAmount } from "@umami/tezos";

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

const message = {
  id: "messageid",
  type: BeaconMessageType.OperationRequest,
  network: { type: NetworkType.GHOSTNET },
  appMetadata: { name: "mockDappName", icon: "" },
} as OperationRequestOutput;
const operation = {
  type: "implicit" as const,
  sender: mockImplicitAccount(0),
  signer: mockImplicitAccount(0),
  operations: [mockContractOrigination(0)],
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

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  executeOperations: jest.fn(),
}));

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetSecretKey: jest.fn(),
}));

describe("<OriginationOperationSignPage />", () => {
  it("renders fee", async () => {
    await renderInModal(<SingleSignPage {...signProps} />);

    await waitFor(() => expect(screen.getByText(prettyTezAmount(123))).toBeVisible());

    expect(screen.getByTestId("sign-page-header")).toHaveTextContent("Origination Request");
    expect(screen.getByTestId("app-name")).toHaveTextContent("mockDappName");
  });

  it("passes correct payload to sign handler", async () => {
    const user = userEvent.setup();
    const testToolkit = new TezosToolkit("test-tezos-toolkit");

    jest.mocked(makeToolkit).mockImplementation(() => Promise.resolve(testToolkit));
    jest.mocked(useGetSecretKey).mockImplementation(() => () => Promise.resolve("secretKey"));
    jest.mocked(executeOperations).mockResolvedValue({ opHash: "ophash" } as BatchWalletOperation);
    jest.spyOn(WalletClient, "respond").mockResolvedValue();

    await renderInModal(<SingleSignPage {...signProps} />);

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
    expect(executeOperations).toHaveBeenCalledWith(operation, testToolkit);

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
