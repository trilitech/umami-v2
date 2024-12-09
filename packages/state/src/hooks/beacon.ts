import {
  type ExtendedP2PPairingResponse,
  type ExtendedPeerInfo,
  type NetworkType,
  Serializer,
} from "@airgap/beacon-wallet";
// import { useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { type RawPkh } from "@umami/tezos";
import { uniq } from "lodash";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { WalletClient, parsePeerInfo } from "../beacon";
import { type DAppBeaconConnectionInfo, beaconActions } from "../slices";

/**
 * Returns connected account pkh & network by a given dAppId.
 *
 * @param dAppId - generated from dApp public key.
 */
export const useGetBeaconConnectionInfo = (
  dAppId: string
): DAppBeaconConnectionInfo | undefined => {
  const beaconConnections = useAppSelector(s => s.beacon);
  return beaconConnections[dAppId];
};

export const useGetBeaconPeersForAccounts = () => {
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
export const useResetBeaconConnections = () => {
  const dispatch = useDispatch();
  return () => dispatch(beaconActions.reset());
};

/**
 * Returns function for adding connection info to {@link beaconSlice}.
 */
export const useAddBeaconConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
    dispatch(beaconActions.addConnection({ dAppId, accountPkh, networkType }));
};

/**
 * Returns function for removing connection from {@link beaconSlice}.
 */
export const useRemoveBeaconConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string) => dispatch(beaconActions.removeConnection(dAppId));
};

export const useBeaconPeers = () => {
  const query = useQuery({
    queryKey: ["beaconPeers"],
    queryFn: async () => {
      const beaconPeers: ExtendedPeerInfo[] = (await WalletClient.getPeers()) as ExtendedPeerInfo[];
      return beaconPeers;
    },
    initialData: [],
  });

  return { peers: query.data, refresh: query.refetch };
};

export const useRemoveBeaconPeer = () => {
  const { refresh } = useBeaconPeers();
  const removeConnectionFromBeaconSlice = useRemoveBeaconConnection();

  return (peerInfo: ExtendedPeerInfo) =>
    WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse, true)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId))
      .finally(() => void refresh());
};

export const useRemoveBeaconPeerBySenderId = () => {
  const { peers } = useBeaconPeers();
  const removePeer = useRemoveBeaconPeer();

  return (senderId: string) =>
    Promise.all(peers.filter(peerInfo => senderId === peerInfo.senderId).map(removePeer));
};

export const useRemoveBeaconPeersByAccounts = () => {
  const getPeersForAccounts = useGetBeaconPeersForAccounts();
  const removePeerBySenderId = useRemoveBeaconPeerBySenderId();

  return (pkhs: RawPkh[]) => Promise.all(getPeersForAccounts(pkhs).map(removePeerBySenderId));
};

export const useAddPeer = () => {
  const { refresh } = useBeaconPeers();
  const toast: any = undefined; //useToast();

  return (payload: string) =>
    new Serializer()
      .deserialize(payload)
      .then(parsePeerInfo)
      .then(peer => WalletClient.addPeer(peer as ExtendedPeerInfo))
      .then(() => refresh())
      .catch(e => {
        toast({
          description:
            "Beacon sync code in the clipboard is invalid. Please copy a beacon sync code from the dApp",
          status: "error",
        });
        console.error(e);
      });
};
