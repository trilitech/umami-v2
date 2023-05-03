import {
  BeaconMessageType,
  BeaconRequestOutputMessage,
  BeaconResponseInputMessage,
  ConnectionContext,
  OperationRequestOutput,
  OperationResponseInput,
  PeerInfo,
  PermissionRequestOutput,
  Serializer,
  SignPayloadRequestOutput,
  SignPayloadResponseInput,
  WalletClient,
} from "@airgap/beacon-wallet";
import { Modal, useDisclosure } from "@chakra-ui/react";
import EventEmitter from "events";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import PermissionRequestDisplay from "./PermissionRequestPannel";
// import { useEffect, useRef } from "react";
// import { useQuery } from "react-query";
// import { EventEmitter } from "stream";

export const walletClient = new WalletClient({
  name: "Umami",
  iconUrl: "",
  appUrl: "https://umamiwallet.com/",
});

const emitter = new EventEmitter();
const REFRESH_PEERS_MESSAGE = "refreshPeers";

export const refreshPeers = () => {
  emitter.emit(REFRESH_PEERS_MESSAGE);
};

export const usePeers = () => {
  const query = useQuery("beaconPeers", async () => {
    const result = await walletClient.getPeers();
    console.log(result);
    return result;
  });

  const refetch = useRef(query.refetch);

  useEffect(() => {
    emitter.addListener(REFRESH_PEERS_MESSAGE, (m) => {
      refetch.current();
    });
  }, []);

  return query;
};

const handlePermissionRequest = async (message: PermissionRequestOutput) => {
  // TODO: Show a UI to the user where he can confirm sharing an account with the DApp
  // eslint-disable-next-line no-debugger
  const publicKey = "edpk...";

  const response: BeaconResponseInputMessage = {
    type: BeaconMessageType.PermissionResponse,
    network: message.network, // Use the same network that the user requested
    scopes: message.scopes,
    id: message.id,
    publicKey: publicKey,
  };

  // Send response back to DApp
  walletClient.respond(response);
};

const handleOperationRequest = async (message: OperationRequestOutput) => {
  // TODO: Show operation details in UI, allow user to approve / reject
  // TODO: Sign message.operationDetails

  const response: OperationResponseInput = {
    type: BeaconMessageType.OperationResponse,
    id: message.id,
    transactionHash: "", // TODO: TX Hash
  };

  walletClient.respond(response);
};
const handleSignPayloadRequest = async (message: SignPayloadRequestOutput) => {
  // TODO: Show operation details in UI, allow user to approve / reject
  // TODO: Sign message.payload

  const response: SignPayloadResponseInput = {
    type: BeaconMessageType.SignPayloadResponse,
    id: message.id,
    signingType: message.signingType,
    signature: "", // TODO: Signature
  };

  walletClient.respond(response);
};

// const handleBeaconMessage = (message: BeaconRequestOutputMessage) => {
//   console.log("message", message);
//   // eslint-disable-next-line no-debugger
//   debugger;
//   if (message.type === BeaconMessageType.PermissionRequest) {
//     handlePermissionRequest(message);
//   } else if (message.type === BeaconMessageType.OperationRequest) {
//     handleOperationRequest(message);
//   } else if (message.type === BeaconMessageType.SignPayloadRequest) {
//     handleSignPayloadRequest(message);
//   } else {
//     console.error("Message Type Not Supported");
//     console.error("Received: ", message);

//     const response: BeaconResponseInputMessage = {
//       type: BeaconMessageType.Error,
//       id: message.id,
//       errorType: BeaconErrorType.ABORTED_ERROR,
//     };

//     walletClient.respond(response);
//   }
// };

export const addPeer = (payload: string) => {
  const serializer = new Serializer();
  serializer
    .deserialize(payload)
    .then((peer) => {
      console.log("Adding peer", peer);
      walletClient.addPeer(peer as PeerInfo).then(refreshPeers);
    })
    .catch((e) => {
      console.error("not a valid sync code: ", payload);
    });
};

export const resetBeacon = () => {
  walletClient.destroy().then(() => {
    window.location.reload();
  });
};

export const resetPeers = () => {
  walletClient.getPeers().then((peers) => {
    if (peers.length > 0) {
      walletClient.removePeer(peers[0] as any, true).then(() => {
        console.log("peer removed", peers[0]);
      });
    } else {
      console.log("no peers to be removed");
    }
  });
};

const renderBeaconNotification = (
  message: BeaconRequestOutputMessage,
  onClose: () => void
) => {
  // Given a beacon message display the correct window:
  // -Permission request
  // -Transfer request
  // Those are the only 2 that are implemented in V1 mobile. Probably others are required.

  switch (message.type) {
    case BeaconMessageType.PermissionRequest: {
      return <PermissionRequestDisplay request={message} onSubmit={onClose} />;
    }

    default:
      return "unsupported";
  }
};

export const useBeaconModalNotification = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const beaconMessage = useRef<BeaconRequestOutputMessage>();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {beaconMessage.current &&
          renderBeaconNotification(beaconMessage.current, onClose)}
      </Modal>
    ),

    onOpen: (
      message: BeaconRequestOutputMessage,
      connectionContext: ConnectionContext
    ) => {
      beaconMessage.current = message;
      onOpen();
    },
  };
};

export const useBeaconInit = () => {
  const { modalElement: beaconModal, onOpen } = useBeaconModalNotification();

  // Ref is needed because otherwise onOpen needs to be added in useEffect dependencies
  // and that might trigger the effect again if onOpen reference isn't stable
  const handleBeaconMessage = useRef(onOpen);

  useEffect(() => {
    // This code runs once, even if the hosting component rerenders
    // because the dependency array is empty
    walletClient
      .init()
      .then(() => {
        console.log("Beacon client initialized successfully");
        walletClient.connect(handleBeaconMessage.current);
      })
      .catch(console.error);
  }, []);

  return beaconModal;
};

export const useBeaconCleanup = () => {
  // Disconnect everything when user logs out
};
