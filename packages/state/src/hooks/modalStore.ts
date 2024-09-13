import { type SessionTypes, type SignClientTypes } from "@walletconnect/types";
import { type Web3WalletTypes } from "@walletconnect/web3wallet";
import { proxy } from "valtio";

interface ModalData {
  proposal?: SignClientTypes.EventArguments["session_proposal"];
  requestEvent?: SignClientTypes.EventArguments["session_request"];
  requestSession?: SessionTypes.Struct;
  request?: Web3WalletTypes.AuthRequest;
  loadingMessage?: string;
  authRequest?: SignClientTypes.EventArguments["session_authenticate"];
}

interface State {
  open: boolean;
  view?:
    | "SessionProposalModal"
    | "SessionSignModal"
    | "SessionSignTypedDataModal"
    | "SessionSendTransactionModal"
    | "SessionGrantPermissionsModal"
    | "SessionSendCallsModal"
    | "SessionUnsuportedMethodModal"
    | "SessionSignTezosModal"
    | "AuthRequestModal"
    | "LoadingModal";
  data?: ModalData;
}

const state = proxy<State>({
  open: false,
});

export const ModalStore = {
  state,

  open(view: State["view"], data: State["data"]) {
    console.log("ModalStore open", view, data);
    state.view = view;
    state.data = data;
    state.open = true;
  },

  close() {
    state.open = false;
  },
};
