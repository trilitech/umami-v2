import { ExtendedP2PPairingResponse, ExtendedPeerInfo, Serializer } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { BeaconRequestNotification } from "./BeaconRequestNotification";
import { makePeerInfo } from "./types";
import { WalletClient } from "./WalletClient";
import { DynamicModalContext } from "../../components/DynamicModal";
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

  return (peerInfo: ExtendedPeerInfo) =>
    WalletClient.removePeer(peerInfo as ExtendedP2PPairingResponse)
      .then(() => removeConnectionFromBeaconSlice(peerInfo.senderId))
      .then(refresh);
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

export const BeaconProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { openWith, onClose } = useContext(DynamicModalContext);

  useEffect(() => {
    WalletClient.init()
      .then(() =>
        WalletClient.connect(message => {
          void openWith(<BeaconRequestNotification message={message} onClose={onClose} />);
        })
      )
      .catch(console.error);
  }, [onClose, openWith]);

  return children;
};

export const resetBeacon = async () => {
  // Until WalletClient.destroy is fixed
  await WalletClient.removeAllAccounts();
  await WalletClient.removeAllAppMetadata();
  await WalletClient.removeAllPeers();
  await WalletClient.removeAllPermissions();
};
