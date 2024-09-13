import { type SignClientTypes } from "@walletconnect/types";
import { parseUri } from "@walletconnect/utils";
import { type Web3WalletTypes } from "@walletconnect/web3wallet";

import { ModalStore } from "./modalStore";
import {SettingsStore} from "./SettingsStore";
import { TEZOS_SIGNING_METHODS } from "./TezosData";
import { web3wallet } from "../wallet-connect";


export function refreshSessionsList() {
  SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()))
}

const onSessionProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
  console.log("WalletConnect session_proposal", proposal);
  SettingsStore.setCurrentRequestVerifyContext(proposal.verifyContext)
  ModalStore.open("SessionProposalModal", { proposal });
  // SettingsStore.setPairings(web3wallet.core.pairing.getPairings());
};

const onAuthRequest = (request: Web3WalletTypes.AuthRequest) => {
  console.log("WalletConnect auth_request", request);
  ModalStore.open("AuthRequestModal", { request });
};

const onSessionRequest = (
  requestEvent: SignClientTypes.EventArguments["session_request"]
) => {
  const { topic, params, verifyContext } = requestEvent;
  const { request } = params;
  const requestSession = web3wallet.engine.signClient.session.get(topic);
  console.log("WalletConnect session_request", requestEvent);
  // set the verify context so it can be displayed in the projectInfoCard
  SettingsStore.setCurrentRequestVerifyContext(verifyContext)

  switch (request.method) {
    case TEZOS_SIGNING_METHODS.TEZOS_GET_ACCOUNTS:
    case TEZOS_SIGNING_METHODS.TEZOS_SEND:
    case TEZOS_SIGNING_METHODS.TEZOS_SIGN:
      return ModalStore.open("SessionSignTezosModal", { requestEvent, requestSession });
    default:
      return ModalStore.open("SessionUnsuportedMethodModal", { requestEvent, requestSession });
  }
};

export function subscribeToWeb3WalletEvents() {
  console.log("Subscribing to events for WalletConnect...");

  web3wallet.on("session_proposal", onSessionProposal);
  web3wallet.on("session_request", onSessionRequest);
  web3wallet.on("session_delete", data => {
    console.log("session_delete event received", data);
    
    // Update the pairings list after a session is remotely deleted
    // cannot find the pairing by the topic Id, so just update the whole list
    // FIXME: both ways do not work, the pairing is not removed from the list
    // const updatedPairings = SettingsStore.state.pairings.filter(pairing => pairing.topic !== data.topic);
    setTimeout(() => {
      SettingsStore.setSessions(Object.values(web3wallet.getActiveSessions()))
    }, 3000);
  });
  
  // auth
  web3wallet.on("auth_request", onAuthRequest);

  web3wallet.engine.signClient.events.on("session_ping", data => console.log("ping", data));
  
  console.log("WalletConnect initialized and subscribed!");
  
}

export async function onConnect(uri: string) {
  console.log("Connecting to WalletConnect...");

  const { topic: pairingTopic } = parseUri(uri);
  let isPairing = false;
    // if for some reason, the proposal is not received, we need to close the modal when the pairing expires (5 mins)
const pairingExpiredListener = ({ topic }: { topic: string }) => {
    if (pairingTopic === topic) {
      console.log({
        description: "Pairing expired. Please try again with new Connection URI",
        status: "error",
      });
      isPairing = false;
      ModalStore.close();
      web3wallet.core.pairing.events.removeListener("pairing_expire", pairingExpiredListener);
    }
  };

  web3wallet.once("session_proposal", () => {
    web3wallet.core.pairing.events.removeListener("pairing_expire", pairingExpiredListener);
  });

  try {
    web3wallet.core.pairing.events.on("pairing_expire", pairingExpiredListener);
    console.log("Pairing ..." + pairingTopic);
    isPairing = true;
    const newPairing = await web3wallet.core.pairing.pair({ uri });
    console.log("Checking for peer metadata...");
    while (isPairing) {
      const pair = web3wallet.core.pairing.getPairings().find(pairing => pairing.topic === newPairing.topic);
      if (pair && pair.peerMetadata) {
        console.log("Peer metadata found!", pair);
        SettingsStore.setPairings([...SettingsStore.state.pairings, pair]);
        break;
      }
      console.log("Waiting for peer metadata...", pair, pair?.peerMetadata);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    isPairing = false;
  } catch (error) {
    console.log({
      description: (error as Error).message,
      status: "error",
    });
  } finally {
    isPairing = false;
    ModalStore.close();
  }
}
