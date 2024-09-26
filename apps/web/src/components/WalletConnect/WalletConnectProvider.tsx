import { type NetworkType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import {
  createWalletKit,
  useAsyncActionHandler,
  useAvailableNetworks,
  walletKit,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { type PropsWithChildren, useCallback, useEffect, useRef } from "react";

import { SessionProposalModal } from "./SessionProposalModal";

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const isWalletKitCreated = useRef(false);
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
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
        console.log("Session proposal from dApp", proposal, walletKit.getActiveSessions());
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
        description: "Session deleted by peer dApp",
        status: "info",
      });
    },
    [toast]
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
        toast({
          description: "Request handling is not implemented yet. Rejecting the request.",
          status: "error",
        });
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
    const initializeWallet = async () => {
      // create the wallet just once
      if (!isWalletKitCreated.current) {
        await createWalletKit();
        isWalletKitCreated.current = true;
      }
      // subscribe after the wallet is created
      walletKit.on("session_proposal", event => void onSessionProposal(event));
      walletKit.on("session_request", event => void onSessionRequest(event));
      walletKit.on("session_delete", event => void onSessionDelete(event));
    };
    void initializeWallet();

    return () => {
      if (isWalletKitCreated.current) {
        walletKit.off("session_proposal", event => void onSessionProposal(event));
        walletKit.off("session_request", event => void onSessionRequest(event));
        walletKit.off("session_delete", event => void onSessionDelete(event));
      }
    };
  }, [onSessionProposal, onSessionRequest, onSessionDelete]);

  return children;
};

export const useOnWalletConnect = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  return (uri: string) => handleAsyncAction(() => walletKit.pair({ uri }));
};
