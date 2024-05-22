import { ExtendedP2PPairingResponse, ExtendedPeerInfo, Serializer } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { makePeerInfo } from "./types";
import { WalletClient } from "./WalletClient";
import { RawPkh } from "../../types/Address";
import { useGetPeersForAccounts, useRemoveConnection } from "../hooks/beaconHooks";

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
      .then(makePeerInfo)
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
