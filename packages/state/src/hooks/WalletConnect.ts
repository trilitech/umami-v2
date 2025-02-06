import { WalletConnectError, WcErrorCode } from "@umami/utils";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { wcActions } from "../slices";
import { walletKit } from "../walletConnect";

// get a toggle to monitor updates in peer list
export const useGetWcPeerListToggle = () => {
  const wcData = useAppSelector(s => s.walletconnect);
  return wcData.peerListUpdatedToggle;
};

// report that the peer list is updated
export const useToggleWcPeerListUpdated = () => {
  const dispatch = useDispatch();
  return () => dispatch(wcActions.togglePeerListUpdated());
};

// remove dApp connection from WalletConnect SDK
export const useDisconnectWalletConnectPeer = () => {
  const togglePeerListUpdated = useToggleWcPeerListUpdated();
  return async (params: { topic: string; reason: ErrorResponse }) => {
    await walletKit.disconnectSession(params).then(() => togglePeerListUpdated());
    console.log("WC session deleted on user request", params);
  };
};

export enum WcScenarioType {
  APPROVE,
  REJECT,
}

// if valid, returns true
// if invalid:
//  - on APPROVE, throws an error
//  - on REJECT, returns false
export const useValidateWcRequest =
  () =>
  (
    type: "session proposal" | "request",
    id: number,
    scenario: WcScenarioType,
    closeModalCallback: () => void
  ) => {
    let isValid = false;

    if (type === "session proposal") {
      const records = walletKit.getPendingSessionProposals();
      isValid = Object.values(records).some(request => request.id === id);
    } else {
      walletKit.getPendingSessionRequests();
      const records = walletKit.getPendingSessionRequests();
      isValid = records.some(request => request.id === id);
    }

    if (!isValid) {
      closeModalCallback();

      if (scenario === WcScenarioType.APPROVE) {
        console.warn(
          `This ${type} is not valid anymore. Check the connection on the dApp side and retry.`
        );
        throw new WalletConnectError(
          `This ${type} is not valid anymore. Check the connection on the dApp side and retry.`,
          WcErrorCode.DAPP_NOTIFICATION_FAILED,
          null
        );
      }
      return false;
    }
    return true;
  };
