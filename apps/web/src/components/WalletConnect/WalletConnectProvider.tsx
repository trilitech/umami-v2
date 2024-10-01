import type EventEmitter from "events";

import { type NetworkType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import {
  createWalletKit,
  useAsyncActionHandler,
  useAvailableNetworks,
  useToggleWcPeerListUpdated,
  walletKit,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { type PropsWithChildren, useCallback, useEffect, useRef } from "react";

import { SessionProposalModal } from "./SessionProposalModal";

enum WalletKitState {
  NOT_INITIALIZED,
  INITIALIZING,
  READY,
}

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const walletKitState = useRef<WalletKitState>(WalletKitState.NOT_INITIALIZED);
  const eventEmitters = useRef<EventEmitter[]>([]);
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
  const toggleWcPeerListUpdated = useToggleWcPeerListUpdated();
  const toast = useToast();

  const availableNetworks: Network[] = useAvailableNetworks();

  const onSessionProposal = useCallback(
    (proposal: WalletKitTypes.SessionProposal) =>
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
        await walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError("UNSUPPORTED_CHAINS"),
        });
      }),
    [availableNetworks, openWith, handleAsyncActionUnsafe]
  );

  const onSessionDelete = useCallback(
    (event: WalletKitTypes.SessionDelete) => {
      // by that time the session is already deleted from WalletKit so we cannot find the dApp name
      console.log("WC session deleted by peer dApp", event);
      toast({
        description: "WalletConnect Session deleted by peer dApp",
        status: "info",
      });
      // now re-render peer list
      toggleWcPeerListUpdated();
    },
    [toast, toggleWcPeerListUpdated]
  );

  const onSessionRequest = useCallback(
    async (event: WalletKitTypes.SessionRequest) => {
      try {
        const activeSessions: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
        if (!(event.topic in activeSessions)) {
          console.error("WalletConnect session request failed. Session not found", event);
          throw new Error("WalletConnect session request failed. Session not found");
        }

        const session = activeSessions[event.topic];

        toast({
          description: `Session request from dApp ${session.peer.metadata.name}`,
          status: "info",
        });
        throw new Error("Not implemented");
      } catch (error) {
        const { id, topic } = event;
        const activeSessions: Record<string, SessionTypes.Struct> = walletKit.getActiveSessions();
        console.error("WalletConnect session request failed", event, error);
        if (event.topic in activeSessions) {
          const session = activeSessions[event.topic];
          toast({
            description: `Session request for dApp ${session.peer.metadata.name} failed. It was rejected.`,
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
      }
    },
    [toast]
  );

  useEffect(() => {
    const session_proposal_listener = (event: WalletKitTypes.SessionProposal) =>
      void onSessionProposal(event);
    const session_request_listener = (event: WalletKitTypes.SessionRequest) =>
      void onSessionRequest(event);
    const session_delete_listener = (event: WalletKitTypes.SessionDelete) =>
      void onSessionDelete(event);

    const addListeners = () => {
      const emitters = [
        walletKit.on("session_proposal", session_proposal_listener),
        walletKit.on("session_request", session_request_listener),
        walletKit.on("session_delete", session_delete_listener),
      ].filter(Boolean) as EventEmitter[];
      eventEmitters.current.push(...emitters);
    };
    const removeListeners = () => {
      eventEmitters.current.forEach(emitter => {
        emitter.removeAllListeners();
      });
      eventEmitters.current = [];
    };

    const initializeWallet = async () => {
      // create the wallet just once
      if (walletKitState.current === WalletKitState.NOT_INITIALIZED) {
        // setting the flag now prevents subsequent render cycles from triggering
        // another createWalletKit call during the first execution
        walletKitState.current = WalletKitState.INITIALIZING;
        await createWalletKit();
        walletKitState.current = WalletKitState.READY;
      }
      if (walletKitState.current === WalletKitState.READY) {
        addListeners();
      }
      // subscribe after the wallet is created
    };
    void initializeWallet();

    return () => {
      if (walletKitState.current === WalletKitState.READY) {
        removeListeners();
      }
    };
  }, [onSessionProposal, onSessionRequest, onSessionDelete]);

  return children;
};

export const useOnWalletConnect = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  return (uri: string) => handleAsyncAction(() => walletKit.pair({ uri }));
};
