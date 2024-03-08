import { BeaconMessageType, SignPayloadRequestOutput, SigningType } from "@airgap/beacon-wallet";
import { Modal } from "@chakra-ui/react";

import { SignPayloadRequestModal } from "./SignPayloadRequestModal";
import { WalletClient } from "./WalletClient";
import { mockImplicitAccount, mockMnemonicAccount } from "../../mocks/factories";
import { encryptedMnemonic1 } from "../../mocks/mockMnemonic";
import { act, render, screen, userEvent, waitFor } from "../../mocks/testUtils";
import { accountsActions } from "../redux/slices/accountsSlice";
import { store } from "../redux/store";

jest.mock("./WalletClient");

const TestComponent = ({ request }: { request: SignPayloadRequestOutput }) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPayloadRequestModal request={request} />
  </Modal>
);

const payload =
  "05010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
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

jest.unmock("../tezos");

beforeEach(() => {
  store.dispatch(
    accountsActions.addMnemonicAccounts({
      seedFingerprint: account.seedFingerPrint,
      accounts: [account],
      encryptedMnemonic: encryptedMnemonic1,
    })
  );
});

describe("<SignPayloadRequestModal />", () => {
  it("renders the dapp name", () => {
    render(<TestComponent request={request} />);

    expect(screen.getByText("mockDappName/dApp Pairing Request")).toBeVisible();
  });

  it("renders the payload to sign", () => {
    render(<TestComponent request={request} />);

    expect(screen.getByText(payload)).toBeVisible();
  });

  it("sends the signed payload back to the DApp", async () => {
    const user = userEvent.setup();

    render(<TestComponent request={request} />);

    await act(() => user.click(screen.getByLabelText("Password")));
    await act(() => user.type(screen.getByLabelText("Password"), "123123123"));
    const confirmButton = screen.getByRole("button", { name: "Connect" });
    expect(confirmButton).toBeEnabled();

    jest.restoreAllMocks();
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
