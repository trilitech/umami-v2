import { ExtendedP2PPairingResponse, Serializer, WalletClient } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

import { BeaconNotification } from "./BeaconNotification";
import { PeerInfoWithId, ProvidedPeerInfo, makePeerInfo } from "./types";
import { DynamicModalContext } from "../../components/DynamicModal";
import { beaconSlice } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const makeClient = () =>
  new WalletClient({
    name: "Umami",
    iconUrl: "",
    appUrl: "https://umamiwallet.com/",
  });

export const walletClient = makeClient();

const PEERS_QUERY_KEY = "beaconPeers";

export const useRefreshPeers = () => {
  const client = useQueryClient();
  return () => client.refetchQueries(PEERS_QUERY_KEY);
};

export const usePeers = () =>
  useQuery(PEERS_QUERY_KEY, () => walletClient.getPeers() as Promise<Array<ProvidedPeerInfo>>);

export const useRemovePeer = () => {
  const refresh = useRefreshPeers();
  return (peerInfo: PeerInfoWithId) => {
    store.dispatch(
      beaconSlice.actions.removeConnection({
        dAppId: peerInfo.senderId,
      })
    );
    return walletClient.removePeer(peerInfo as ExtendedP2PPairingResponse).then(refresh);
  };
};

export const useAddPeer = () => {
  const refresh = useRefreshPeers();
  const toast = useToast();
  return (payload: string) => {
    const serializer = new Serializer();
    serializer
      .deserialize(payload)
      .then(makePeerInfo)
      .then(peer => {
        walletClient.addPeer(peer).then(refresh);
      })
      .catch(e => {
        toast({
          description:
            "Beacon sync code in the clipboard is invalid. Please copy a beacon sync code from the dApp",
          status: "error",
        });
        console.error(e);
      });
  };
};

export const BeaconProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { openWith, onClose } = useContext(DynamicModalContext);
  useEffect(() => {
    walletClient
      .init()
      .then(() => {
        walletClient.connect(message => {
          openWith(<BeaconNotification message={message} onClose={onClose} />);
        });
      })
      .catch(console.error);
  }, [onClose, openWith]);

  return <>{children}</>;
};

export const resetBeacon = async () => {
  // Until walletClient.destroy is fixed
  await walletClient.removeAllAccounts();
  await walletClient.removeAllAppMetadata();
  await walletClient.removeAllPeers();
  await walletClient.removeAllPermissions();
  store.dispatch(beaconSlice.actions.reset());
};
