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
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { getSdkError } from "@walletconnect/utils";
import { type PropsWithChildren, useEffect } from "react";

import { SessionProposalModal } from "./SessionProposalModal";

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const toast = useToast();
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
  const availableNetworks = useAvailableNetworks();

  useEffect(() => {
    // dApp can release WalletConnect session any time and then the Wallet is notified by the WalletConnect server.
    const onSessionDelete = (event: WalletKitTypes.SessionDelete) =>
      toast({
        description: `dApp ${event.topic} released the connection.`,
        status: "info",
      });

    const onSessionProposal = (proposal: WalletKitTypes.SessionProposal) =>
      void handleAsyncActionUnsafe(() => {
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
        const networkNames = availableNetworks.map(network => network.name);
        // the network contains a namespace, e.g. tezos:mainnet
        if (!networkNames.includes(network.split(":")[1])) {
          throw new Error(
            `The requested required network "${network}" is not supported. Available: ${networkNames}`
          );
        }

        return openWith(<SessionProposalModal network={network} proposal={proposal} />, {});
      }).catch(() =>
        // dApp is waiting so we need to notify it
        walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError("UNSUPPORTED_CHAINS"),
        })
      );

    const onSessionRequest = (event: WalletKitTypes.SessionRequest) =>
      void handleAsyncActionUnsafe(() => {
        console.log("TODO: Session request received. Handling to be implemented", event);

        const response = formatJsonRpcError(event.id, getSdkError("USER_REJECTED_METHODS").message);
        return walletKit.respondSessionRequest({ topic: event.topic, response });
      }).catch(() => {
        // dApp is waiting so we need to notify it
        const response = formatJsonRpcError(event.id, getSdkError("INVALID_METHOD").message);
        return walletKit.respondSessionRequest({ topic: event.topic, response });
      });

    const initializeWallet = async () => {
      console.log("Initializing walletKit");
      await createWalletKit().then(() => {
        walletKit.on("session_proposal", onSessionProposal);
        walletKit.on("session_request", onSessionRequest);
        walletKit.on("session_delete", onSessionDelete);
      });
    };

    void initializeWallet();

    return () => {
      // walletKit might be unitialized yet
      if (walletKit) {
        walletKit.removeListener("session_proposal", onSessionProposal);
        walletKit.removeListener("session_request", onSessionRequest);
        walletKit.removeListener("session_delete", onSessionDelete);
      }
    };
  }, [availableNetworks, handleAsyncActionUnsafe, openWith, toast]);

  return children;
};

export const useOnWalletConnect = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  return (uri: string) =>
    handleAsyncAction(async () => {
      await walletKit.pair({ uri });
    });
};