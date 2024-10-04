import { useToast } from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import { createWalletKit, useRemoveWcConnection, useWcPeers, walletKit } from "@umami/state";
import { formatJsonRpcError } from "@walletconnect/jsonrpc-utils";
import { getSdkError, parseUri } from "@walletconnect/utils";
import { type PropsWithChildren, useEffect } from "react";

import { SessionProposalModal } from "./SessionProposalModal";

export const context = {};

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const { openWith } = useDynamicModalContext();
  const { refresh } = useWcPeers();
  const toast = useToast();
  const removeWcPeer = useRemoveWcConnection();

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await createWalletKit();
        walletKit.on("session_proposal", event => void onSessionProposal(event));
        walletKit.on("session_request", event => void onSessionRequest(event));
        walletKit.on("session_delete", event => void onSessionDelete(event));
      } catch (error) {
        console.error("Error initializing Web3Wallet:", error);
      }
    };

    void initializeWallet();
  });

  const onSessionProposal = async (event: WalletKitTypes.SessionProposal) => {
    const modal = <SessionProposalModal proposal={event} />;

    try {
      await openWith(modal, {});
    } catch (error) {
      console.error("Failed to open SessionProposalModal modal:", error);
    }

    return () => {};
  };

  const onSessionRequest = async (event: WalletKitTypes.SessionRequest) => {
    const { topic, id } = event;
    console.log("TODO: Session request received. Handling to be implemented", id, event);

    const response = rejectTezosRequest(event);

    await walletKit.respondSessionRequest({ topic, response });
  };

  const onSessionDelete = async (event: WalletKitTypes.SessionDelete) => {
    const { topic, id } = event;
    removeWcPeer(topic);
    toast({
      description: "Session deleted by dApp",
      status: "info",
    });
    refresh();
  };

  const rejectTezosRequest = (event: WalletKitTypes.SessionRequest) => {
    const { id } = event;

    return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
  };

  return children;
};

export const onConnect = async (uri: string) => {
  const { topic: pairingTopic } = parseUri(uri);

  try {
    console.debug("Pairing WalletConnect", pairingTopic);
    await walletKit.pair({ uri });
  } catch (error) {
    console.error("Pairing failed", (error as Error).message);
  }
};
