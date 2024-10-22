import { type NetworkType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import {
  createWalletKit,
  useAsyncActionHandler,
  useAvailableNetworks,
  useGetAllWcConnectionInfo,
  useRemoveWcConnection,
  useWcPeers,
  walletKit,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { getSdkError } from "@walletconnect/utils";
import { type PropsWithChildren, useEffect } from "react";

import { SessionProposalModal } from "./SessionProposalModal";
import { useHandleWcRequest } from "./useHandleWcRequest";

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const onSessionProposal = useOnSessionProposal();
  const onSessionDelete = useOnSessionDelete();
  const onSessionRequest = useOnSessionRequest();

  useEffect(() => {
    const initializeWallet = async () => {
      await createWalletKit();
      walletKit.on("session_proposal", event => void onSessionProposal(event));
      walletKit.on("session_request", event => void onSessionRequest(event));
      walletKit.on("session_delete", event => void onSessionDelete(event));
    };

    void initializeWallet();
  });

  return children;
};

const useOnSessionProposal = () => {
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
  const availableNetworks: Network[] = useAvailableNetworks();

  return (proposal: WalletKitTypes.SessionProposal) =>
    handleAsyncActionUnsafe(async () => {
      // dApp sends in the session proposal the required networks and the optional networks.
      // The response must contain all the required networks but Umami supports just one per request.
      // So if the list of required networks is more than one or the required network is not supported, we can only reject the proposal.
      const requiredNetworks = Object.entries(proposal.params.requiredNamespaces)
        .map(([key, values]) => (key.includes(":") ? key : (values.chains ?? [])))
        .flat()
        .filter(Boolean);

      if (requiredNetworks.length !== 1) {
        throw new Error(
          `Umami supports only one network per request, got required networks: ${requiredNetworks}`
        );
      }
      const network = requiredNetworks[0] as NetworkType;
      const availablenetworks = availableNetworks.map(network => network.name);
      // the network contains a namespace, e.g. tezos:mainnet
      if (!availablenetworks.includes(network.split(":")[1])) {
        throw new Error(
          `The requested required network "${network}" is not supported. Available: ${availablenetworks}`
        );
      }

      await openWith(<SessionProposalModal network={network} proposal={proposal} />, {});
    }).catch(async () => {
      // dApp is waiting so we need to notify it
      await walletKit.rejectSession({ id: proposal.id, reason: getSdkError("UNSUPPORTED_CHAINS") });
    });
};

const useOnSessionRequest = () => {
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { peers } = useWcPeers();
  const state = useGetAllWcConnectionInfo();
  const handleWcRequest = useHandleWcRequest();
  const toast = useToast();

  return (event: WalletKitTypes.SessionRequest) =>
    handleAsyncActionUnsafe(async () => {
      console.log("Session request and state", event, state, peers);
      if (event.topic in state) {
        console.log("Session request from dApp", state[event.topic], peers[event.topic]);
        toast({
          description: `Session request from dApp ${peers[event.topic].peer.metadata.name}`,
          status: "info",
        });
      }
      await handleWcRequest(event);
    }).catch(async error => {
      const { id, topic } = event;
      console.error("WalletConnect session request failed", event, peers, error);
      if (event.topic in peers) {
        toast({
          description: `Session request for dApp ${peers[topic].peer.metadata.name} failed. It was rejected.`,
          status: "error",
        });
      } else {
        toast({
          description: `Session request for dApp ${topic} failed. It was rejected. Peer not found by topic.`,
          status: "error",
        });
      }
      // dApp is waiting so we need to notify it
      const response = formatJsonRpcError(id, getSdkError("INVALID_METHOD").message);
      await walletKit.respondSessionRequest({ topic, response });
    });
};

const useOnSessionDelete = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { peers, refresh } = useWcPeers();
  const removeWcPeer = useRemoveWcConnection();
  const toast = useToast();

  return (event: WalletKitTypes.SessionDelete) =>
    handleAsyncAction(async () => {
      const { topic } = event;
      if (topic in peers) {
        toast({
          description: `Session deleted by dApp ${peers[topic].peer.metadata.name}`,
          status: "info",
        });
      } else {
        console.error(`Session deleted by dApp but not known locally. Topic: ${topic}`);
      }
      removeWcPeer(topic);

      // update peer list in the UI
      await refresh();
    });
};

export const useOnWalletConnect = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  return (uri: string) =>
    handleAsyncAction(async () => {
      await walletKit.pair({ uri });
    });
};
