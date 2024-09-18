import {
  BeaconMessageType,
  type SignPayloadRequestOutput,
  SigningType,
} from "@airgap/beacon-wallet";
import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, WalletClient, accountsActions, makeStore } from "@umami/state";
import { encryptedMnemonic1 } from "@umami/test-utils";

import { SignPayloadRequestModal } from "./SignPayloadRequestModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

const payload =
  "05010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
const decodedPayload = "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!";
const request: SignPayloadRequestOutput = {
  payload,
  senderId: "mockSenderId",
  type: BeaconMessageType.SignPayloadRequest,
  version: "2",
  sourceAddress: mockImplicitAccount(1).address.pkh,
  signingType: SigningType.RAW,
  id: "mockMessageId",
  appMetadata: { name: "mockDappName", senderId: "mockSenderId" },
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
    await renderInModal(<SignPayloadRequestModal request={request} />, store);

    await waitFor(() =>
      expect(screen.getByText("mockDappName/dApp Pairing Request")).toBeVisible()
    );
  });

  it("renders the payload to sign", async () => {
    await renderInModal(<SignPayloadRequestModal request={request} />, store);

    await waitFor(() => expect(screen.getByText(new RegExp(decodedPayload))).toBeVisible());
  });

  it("sends the signed payload back to the DApp", async () => {
    const user = userEvent.setup();
    jest.spyOn(WalletClient, "respond");
    await renderInModal(<SignPayloadRequestModal request={request} />, store);

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
});
