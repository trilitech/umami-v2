import { type NetworkType } from "@airgap/beacon-wallet";
import { useToast } from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import {
  createWalletKit,
  useAsyncActionHandler,
  useAvailableNetworks,
  useWcPeers,
  walletKit,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { getSdkError } from "@walletconnect/utils";
import { type PropsWithChildren, useEffect } from "react";

import { SessionProposalModal } from "./SessionProposalModal";

export const context = {};

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
        .map(([key, values]) => (key.includes(":") ? key : values.chains))
        .flat();

      if (requiredNetworks.length !== 1 || requiredNetworks[0] === undefined) {
        throw new Error(
          `Umami supports only one network per request, got too many required networks: ${requiredNetworks}`
        );
      }
      const network = requiredNetworks[0] as NetworkType;
      const availablenetworks = availableNetworks.map(network => network.name);
      // the network contains a namespace, e.g. tezos:mainnet
      if (!availablenetworks.includes(network.split(":")[1])) {
        throw new Error(
          `The required network ${network} is not supported. Available: ${availablenetworks}`
        );
      }

      await openWith(<SessionProposalModal network={network} proposal={proposal} />, {});
    }).catch(async () => {
      // dApp is waiting so we need to notify it
      await walletKit.rejectSession({ id: proposal.id, reason: getSdkError("UNSUPPORTED_CHAINS") });
    });
};

const useOnSessionRequest = () => {
  const { handleAsyncAction } = useAsyncActionHandler();

  return (event: WalletKitTypes.SessionRequest) =>
    handleAsyncAction(async () => {
      console.log("TODO: Session request received. Handling to be implemented", event);

      const response = formatJsonRpcError(event.id, getSdkError("USER_REJECTED_METHODS").message);
      await walletKit.respondSessionRequest({ topic: event.topic, response });
    }).catch(async () => {
      // dApp is waiting so we need to notify it
      const response = formatJsonRpcError(event.id, getSdkError("INVALID_METHOD").message);
      await walletKit.respondSessionRequest({ topic: event.topic, response });
    });
};

const useOnSessionDelete = () => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { refresh } = useWcPeers();
  const toast = useToast();

  return (event: WalletKitTypes.SessionDelete) =>
    handleAsyncAction(async () => {
      toast({
        description: "Session deleted by dApp",
        status: "info",
      });
      await refresh();
    });
};

export const useOnWalletConnect = () => {
  const toast = useToast();
  return async (uri: string) => {
    try {
      await walletKit.pair({ uri });
    } catch (error) {
      toast({
        title: "Pairing failed",
        description: (error as Error).message,
        status: "error",
      });
    }
  };
};
