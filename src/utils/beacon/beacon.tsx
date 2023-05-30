import {
  BeaconRequestOutputMessage,
  ConnectionContext,
  PeerInfo,
  Serializer,
  WalletClient,
} from "@airgap/beacon-wallet";
import { Modal, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { BeaconNotification } from "./BeaconNotification";

const makeClient = () =>
  new WalletClient({
    name: "Umami",
    iconUrl: "",
    appUrl: "https://umamiwallet.com/",
  });

export let walletClient = makeClient();

const PEERS_QUERY_KEY = "beaconPeers";

export const useRefreshPeers = () => {
  const client = useQueryClient();
  return () => client.refetchQueries(PEERS_QUERY_KEY);
};

export const usePeers = () =>
  useQuery(PEERS_QUERY_KEY, () => walletClient.getPeers());

export const useRemovePeer = () => {
  const refresh = useRefreshPeers();
  return (peerInfo: PeerInfo) =>
    walletClient.removePeer(peerInfo as any).then(refresh);
};

export const useAddPeer = () => {
  const refresh = useRefreshPeers();
  return (payload: string) => {
    const serializer = new Serializer();
    serializer
      .deserialize(payload)
      .then((peer) => {
        walletClient.addPeer(peer as PeerInfo).then(refresh);
      })
      .catch((e) => {
        console.error("not a valid sync code: ", payload, e);
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
          <BeaconNotification
            message={beaconMessage.current}
            onSuccess={onClose}
          />
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
  await walletClient.destroy();
  walletClient = makeClient();
};
