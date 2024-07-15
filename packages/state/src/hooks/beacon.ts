import {
  type ExtendedP2PPairingResponse,
  type ExtendedPeerInfo,
  type NetworkType,
  Serializer,
} from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { type RawPkh } from "@umami/tezos";
import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { WalletClient, parsePeerInfo } from "../beacon";
import { type DAppConnectionInfo, beaconActions } from "../slices";
/**
 * Returns connected account pkh & network by a given dAppId.
 *
 * @param dAppId - generated from dApp public key.
 */
export const useGetConnectionInfo = (dAppId: string): DAppConnectionInfo | undefined => {
  const beaconConnections = useAppSelector(s => s.beacon);
  return beaconConnections[dAppId];
};

export const useGetPeersForAccounts = () => {
  const beaconConnections = useAppSelector(s => s.beacon);

  return (pkhs: RawPkh[]) =>
    uniq(
      Object.entries(beaconConnections)
        .filter(([_, connectionInfo]) => pkhs.includes(connectionInfo.accountPkh))
        .map(([dAppId, _]) => dAppId)
    );
};

/**
 * Returns function for removing all connections from {@link beaconSlice}.
 */
export const useResetConnections = () => {
  const dispatch = useDispatch();
  return () => dispatch(beaconActions.reset());
};

/**
 * Returns function for adding connection info to {@link beaconSlice}.
 */
export const useAddConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
    dispatch(beaconActions.addConnection({ dAppId, accountPkh, networkType }));
};

/**
 * Returns function for removing connection from {@link beaconSlice}.
 */
export const useRemoveConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string) => dispatch(beaconActions.removeConnection(dAppId));
};

export const usePeers = () => {
  const [peers, setPeers] = useState<ExtendedPeerInfo[]>([]);

  const refresh = useCallback(async () => {
    const peers = await WalletClient.getPeers();
    setPeers(peers as ExtendedPeerInfo[]);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { peers, refresh };
};

export const useRemovePeer = () => {
  const { refresh } = usePeers();
  const removeConnectionFromBeaconSlice = useRemoveConnection();

  return (peerInfo: ExtendedPeerInfo) =>
    WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse, true)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId))
      .finally(() => void refresh());
};

export const useRemovePeerBySenderId = () => {
  const { peers } = usePeers();
  const removePeer = useRemovePeer();

  return (senderId: string) =>
    Promise.all(peers.filter(peerInfo => senderId === peerInfo.senderId).map(removePeer));
};

export const useRemovePeersByAccounts = () => {
  const getPeersForAccounts = useGetPeersForAccounts();
  const removePeerBySenderId = useRemovePeerBySenderId();

  return (pkhs: RawPkh[]) => Promise.all(getPeersForAccounts(pkhs).map(removePeerBySenderId));
};

export const useAddPeer = () => {
  const { refresh } = usePeers();
  const toast = useToast();

  return (payload: string) =>
    new Serializer()
      .deserialize(payload)
      .then(parsePeerInfo)
      .then(peer => WalletClient.addPeer(peer as ExtendedPeerInfo))
      .then(refresh)
      .catch(e => {
        toast({
          description:
            "Beacon sync code in the clipboard is invalid. Please copy a beacon sync code from the dApp",
          status: "error",
        });
        console.error(e);
      });
};
