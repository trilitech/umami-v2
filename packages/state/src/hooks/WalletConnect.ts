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
