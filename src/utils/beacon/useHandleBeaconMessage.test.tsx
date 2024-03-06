import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  NetworkType,
  PermissionRequestOutput,
  PermissionScope,
} from "@airgap/beacon-wallet";

import { useHandleBeaconMessage } from "./useHandleBeaconMessage";
import { act, dynamicModalContextMock, renderHook, screen, waitFor } from "../../mocks/testUtils";
import { mockToast } from "../../mocks/toast";

jest.mock("./WalletClient");

const SENDER_ID = "mockSenderId";

describe("<useHandleBeaconMessage />", () => {
  test("permission request", async () => {
    const message: PermissionRequestOutput = {
      appMetadata: { name: "mockDappName", senderId: SENDER_ID },
      id: "mockMessageId",
      network: { type: NetworkType.MAINNET },
      scopes: [PermissionScope.SIGN],
      senderId: SENDER_ID,
      type: BeaconMessageType.PermissionRequest,
      version: "2",
    };

    const {
      result: { current: handleMessage },
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await screen.findByText("Permission Request");
  });

  it("displays an error on an unknown Beacon request", async () => {
    const message = {
      type: BeaconMessageType.BlockchainRequest,
    } as unknown as BeaconRequestOutputMessage;

    const {
      result: { current: handleMessage },
    } = renderHook(useHandleBeaconMessage);

    act(() => handleMessage(message));

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Error while processing Beacon request: Unknown Beacon message type: blockchain_request",
        status: "error",
      })
    );
    expect(dynamicModalContextMock.openWith).not.toHaveBeenCalled();
  });
});
