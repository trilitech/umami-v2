import {
  BeaconErrorType,
  BeaconMessageType,
  BeaconResponseInputMessage,
  OperationRequestOutput,
  OperationResponseInput,
  PeerInfo,
  PermissionRequestOutput,
  Serializer,
  SignPayloadRequestOutput,
  SignPayloadResponseInput,
  WalletClient,
} from "@airgap/beacon-wallet";
import EventEmitter from "events";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
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
  const queryRef = useRef(useQuery("beaconPeers", walletClient.getPeers));

  useEffect(() => {
    emitter.addListener(REFRESH_PEERS_MESSAGE, queryRef.current.refetch);
  }, []);

  return queryRef.current;
};

const handlePermissionRequest = async (message: PermissionRequestOutput) => {
  // TODO: Show a UI to the user where he can confirm sharing an account with the DApp
  // eslint-disable-next-line no-debugger
  debugger;
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

walletClient.init().then(() => {
  console.log("init");
  walletClient
    .connect(async (message) => {
      console.log("message", message);
      if (message.type === BeaconMessageType.PermissionRequest) {
        handlePermissionRequest(message);
      } else if (message.type === BeaconMessageType.OperationRequest) {
        handleOperationRequest(message);
      } else if (message.type === BeaconMessageType.SignPayloadRequest) {
        handleSignPayloadRequest(message);
      } else {
        console.error("Message Type Not Supported");
        console.error("Received: ", message);

        const response: BeaconResponseInputMessage = {
          type: BeaconMessageType.Error,
          id: message.id,
          errorType: BeaconErrorType.ABORTED_ERROR,
        };

        walletClient.respond(response);
      }
    })
    .catch((error) => console.error("connect error", error));
});

export const addPeer = (payload: string) => {
  const serializer = new Serializer();
  serializer
    .deserialize(payload)
    .then((peer) => {
      console.log("Adding peer", peer);
      walletClient.addPeer(peer as PeerInfo).then(() => {});
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
