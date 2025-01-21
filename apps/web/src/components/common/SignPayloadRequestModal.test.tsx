import { SigningType } from "@airgap/beacon-wallet";
import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, WalletClient, accountsActions, makeStore, walletKit } from "@umami/state";
import { encryptedMnemonic1 } from "@umami/test-utils";
import { type JsonRpcResult } from "@walletconnect/jsonrpc-utils";

import { SignPayloadRequestModal } from "./SignPayloadRequestModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";
import { type SignPayloadProps } from "../SendFlow/utils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
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

const payload =
  "05010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
const decodedPayload = "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!";
const beaconOpts: SignPayloadProps = {
  appName: "mockBeaconDappName",
  appIcon: "",
  payload,
  signer: mockImplicitAccount(1),
  signingType: SigningType.RAW,
  requestId: { sdkType: "beacon", id: "mockMessageId" },
};
const wcOpts: SignPayloadProps = {
  appName: "mockWalletConnectDappName",
  appIcon: "",
  payload,
  signer: mockImplicitAccount(1),
  signingType: SigningType.RAW,
  requestId: { sdkType: "walletconnect", id: 123, topic: "mockTopic" },
};

const account = mockMnemonicAccount(1);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  store.dispatch(
    accountsActions.addMnemonicAccounts({
      seedFingerprint: account.seedFingerPrint,
      accounts: [account],
      encryptedMnemonic: encryptedMnemonic1,
    })
  );
});

describe("<SignPayloadRequestModal />", () => {
  it("renders the dapp name", async () => {
    await renderInModal(<SignPayloadRequestModal opts={beaconOpts} />, store);

    await waitFor(() =>
      expect(screen.getByTestId("sign-page-header")).toHaveTextContent("Sign Payload Request")
    );
  });

  it("renders the payload to sign", async () => {
    await renderInModal(<SignPayloadRequestModal opts={beaconOpts} />, store);

    await waitFor(() => expect(screen.getByText(new RegExp(decodedPayload))).toBeVisible());
  });

  it("Beacon sends the signed payload back to the DApp", async () => {
    const user = userEvent.setup();
    jest.spyOn(WalletClient, "respond");
    await renderInModal(<SignPayloadRequestModal opts={beaconOpts} />, store);

    await act(() => user.click(screen.getByLabelText("Password")));
    await act(() => user.type(screen.getByLabelText("Password"), "123123123"));
    const confirmButton = screen.getByRole("button", { name: "Sign" });
    expect(confirmButton).toBeEnabled();

    await act(() => user.click(confirmButton));

    await waitFor(() =>
      expect(WalletClient.respond).toHaveBeenCalledWith({
        id: "mockMessageId",
        signingType: "raw",
        type: "sign_payload_response",
        signature:
          "edsigtqC1pJWaJ7rGm75PZAWyX75hH2BiKCb1EM3MotDSjEqHEA2tVZ1FPd8k4SwRMR74ytDVcCXrZqKJ9LtsDoduCJLMAeBq88",
      })
    );
  });
  it("WalletConnect sends the signed payload back to the DApp", async () => {
    const user = userEvent.setup();
    jest.spyOn(walletKit, "respondSessionRequest");
    await renderInModal(<SignPayloadRequestModal opts={wcOpts} />, store);

    await waitFor(() =>
      expect(screen.getByTestId("sign-page-header")).toHaveTextContent("Sign Payload Request")
    );
    await waitFor(() => expect(screen.getByText(new RegExp(decodedPayload))).toBeVisible());

    expect(screen.getByTestId("verifyinfobox")).toBeVisible();
    expect(screen.getByText("This domain is unknown. Cannot verify it.")).toBeInTheDocument();

    await act(() => user.click(screen.getByLabelText("Password")));
    await act(() => user.type(screen.getByLabelText("Password"), "123123123"));
    const confirmButton = screen.getByRole("button", { name: "Sign" });
    expect(confirmButton).toBeEnabled();

    await act(() => user.click(confirmButton));

    const response: JsonRpcResult = {
      id: 123,
      jsonrpc: "2.0",
      result: {
        signature:
          "edsigtqC1pJWaJ7rGm75PZAWyX75hH2BiKCb1EM3MotDSjEqHEA2tVZ1FPd8k4SwRMR74ytDVcCXrZqKJ9LtsDoduCJLMAeBq88",
      },
    } as unknown as JsonRpcResult;
    await waitFor(() =>
      expect(walletKit.respondSessionRequest).toHaveBeenCalledWith({ topic: "mockTopic", response })
    );
  });
  it("Verify info box is visible for default", async () => {
    await renderInModal(<SignPayloadRequestModal opts={wcOpts} />, store);
    await waitFor(() => {
      expect(screen.getByText("This domain is unknown. Cannot verify it.")).toBeInTheDocument();
    });
  });
  it("Verify info box is visible for UNKNOWN", async () => {
    await renderInModal(
      <SignPayloadRequestModal opts={{ ...wcOpts, isScam: false, validationStatus: "UNKNOWN" }} />,
      store
    );
    await waitFor(() => {
      expect(screen.getByText("This domain is unknown. Cannot verify it.")).toBeInTheDocument();
    });
  });
  it("Verify info box is visible for INVALID", async () => {
    await renderInModal(
      <SignPayloadRequestModal opts={{ ...wcOpts, isScam: false, validationStatus: "INVALID" }} />,
      store
    );
    await waitFor(() => {
      expect(screen.getByText("This domain is invalid.")).toBeInTheDocument();
    });
  });
  it("Verify info box is visible for VALID", async () => {
    await renderInModal(
      <SignPayloadRequestModal opts={{ ...wcOpts, isScam: false, validationStatus: "VALID" }} />,
      store
    );
    await waitFor(() => {
      expect(screen.getByText("This domain is verified.")).toBeInTheDocument();
    });
  });
  it("Verify info box is visible for SCAM", async () => {
    await renderInModal(
      <SignPayloadRequestModal opts={{ ...wcOpts, isScam: true, validationStatus: "UNKNOWN" }} />,
      store
    );
    await waitFor(() => {
      expect(
        screen.getByText("This domain is suspected to be a SCAM. Potential threat detected.")
      ).toBeInTheDocument();
    });
  });
});
