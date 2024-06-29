import {
  type ExtendedP2PPairingResponse,
  type ExtendedPeerInfo,
  type NetworkType,
  Serializer,
} from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WalletClient, parsePeerInfo } from "@umami/core";
import { type RawPkh } from "@umami/tezos";
import { uniq } from "lodash";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
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

const PEERS_QUERY_KEY = "beaconPeers";

export const useRefreshPeers = () => {
  const client = useQueryClient();
  return () => client.refetchQueries({ queryKey: [PEERS_QUERY_KEY] });
};

export const usePeers = () =>
  useQuery({
    queryKey: [PEERS_QUERY_KEY],
    // getPeers actually returns ExtendedPeerInfo (with the senderId)
    queryFn: () => WalletClient.getPeers(),
    initialData: [],
  }).data as ExtendedPeerInfo[];

export const useRemovePeer = () => {
  const refresh = useRefreshPeers();
  const removeConnectionFromBeaconSlice = useRemoveConnection();

  return (peerInfo: ExtendedPeerInfo) =>
    WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse, true)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId))
      .finally(() => void refresh());
};

export const useRemovePeerBySenderId = () => {
  const peers = usePeers();
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
  const refresh = useRefreshPeers();
  const toast = useToast();

  return (payload: string) =>
    new Serializer()
      .deserialize(payload)
      .then(parsePeerInfo)
      .then(peer => WalletClient.addPeer(peer))
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
