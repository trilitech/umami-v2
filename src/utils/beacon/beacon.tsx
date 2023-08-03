import {
  BeaconRequestOutputMessage,
  ConnectionContext,
  ExtendedP2PPairingResponse,
  Serializer,
  WalletClient,
} from "@airgap/beacon-wallet";
import { Modal, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { BeaconNotification } from "./BeaconNotification";
import { makePeerInfo, PeerInfo } from "./types";

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
  useQuery(PEERS_QUERY_KEY, () => walletClient.getPeers() as Promise<Array<PeerInfo>>);

export const useRemovePeer = () => {
  const refresh = useRefreshPeers();
  return (peerInfo: PeerInfo) =>
    walletClient.removePeer(peerInfo as ExtendedP2PPairingResponse).then(refresh);
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
          title: "Beacon sync code in the clipboard is invalid",
          description: "Please copy a beacon sync code from the dApp",
          status: "error",
        });
        console.error(e);
      });
  };
};

export const useBeaconModalNotification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const beaconMessage = useRef<BeaconRequestOutputMessage>();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {beaconMessage.current && (
          <BeaconNotification message={beaconMessage.current} onSuccess={onClose} />
        )}
      </Modal>
    ),

    onOpen: (message: BeaconRequestOutputMessage, _: ConnectionContext) => {
      beaconMessage.current = message;
      onOpen();
    },
  };
};

// Need this ignore BS because useEffect runs twice in development:
// https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
export const useBeaconInit = () => {
  const { modalElement: beaconModal, onOpen } = useBeaconModalNotification();
  const ignore = useRef(false);
  const handleBeaconMessage = useRef(onOpen);

  useEffect(() => {
    if (!ignore.current) {
      walletClient
        .init()
        .then(() => {
          walletClient.connect(handleBeaconMessage.current);
        })
        .catch(console.error)
        .finally(() => {
          ignore.current = false;
        });
    }

    return () => {
      ignore.current = true;
    };
  }, []);

  return beaconModal;
};

export const resetBeacon = async () => {
  // Until walletClient.destroy is fixed
  await walletClient.removeAllAccounts();
  await walletClient.removeAllAppMetadata();
  await walletClient.removeAllPeers();
  await walletClient.removeAllPermissions();
};
