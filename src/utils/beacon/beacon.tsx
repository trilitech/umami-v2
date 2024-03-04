import { ExtendedP2PPairingResponse, ExtendedPeerInfo, Serializer } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { makePeerInfo } from "./types";
import { WalletClient } from "./WalletClient";
import { RawPkh } from "../../types/Address";
import { useRemoveConnection } from "../hooks/beaconHooks";

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

  return (peerInfo: ExtendedPeerInfo, accountPkh?: RawPkh) => {
    if (!accountPkh) {
      // No saved data for this dApp, just remove the peer connection.
      return WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse).then(refresh);
    }
    // Remove both: peer connection and saved data.
    return WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId, accountPkh))
      .then(refresh);
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
