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
    queryFn: () => WalletClient.getPeers() as Promise<ExtendedPeerInfo[]>,
  });

export const useRemovePeer = () => {
  const refresh = useRefreshPeers();
  const removeConnectionFromBeaconSlice = useRemoveConnection();

  return (peerInfo: ExtendedPeerInfo) =>
    WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId))
      .then(refresh);
};

export const useRemovePeersByAccounts = () => {
  const getPeersForAccounts = useGetPeersForAccounts();

  return async (pkhs: RawPkh[]) => {
    const peersToRemove = getPeersForAccounts(pkhs);
    // getPeers actually returns ExtendedPeerInfo (with the senderId)
    const peersData = (await WalletClient.getPeers()) as ExtendedPeerInfo[];

    await Promise.all(
      peersData
        .filter(peerInfo => peersToRemove.includes(peerInfo.senderId))
        .map(peerInfo => WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse))
    );
  };
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
