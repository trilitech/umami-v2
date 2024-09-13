import { type PairingTypes, type SessionTypes, type Verify } from "@walletconnect/types";
import { proxy } from "valtio";

const TEST_NETS_ENABLED_KEY = "TEST_NETS";
const SMART_ACCOUNTS_ENABLED_KEY = "SMART_ACCOUNTS";
const MODULE_MANAGEMENT_ENABLED_KEY = "MODULE_MANAGEMENT";

/**
 * Types
 */
interface State {
  testNets: boolean;
  account: number;
  pairings: PairingTypes.Struct[];
  tezosAddress: string;
  relayerRegionURL: string;
  activeChainId: string;
  currentRequestVerifyContext?: Verify.Context;
  sessions: SessionTypes.Struct[];
  smartAccountSponsorshipEnabled: boolean;
  smartAccountEnabled: boolean;
  moduleManagementEnabled: boolean;
}

/**
 * State
 */
const state = proxy<State>({
  testNets:
    typeof localStorage !== "undefined"
      ? Boolean(localStorage.getItem(TEST_NETS_ENABLED_KEY))
      : true,
  account: 0,
  pairings: [],
  activeChainId: "1",
  tezosAddress: "",
  relayerRegionURL: "",
  sessions: [],
  smartAccountSponsorshipEnabled: false,
  smartAccountEnabled:
    typeof localStorage !== "undefined"
      ? Boolean(localStorage.getItem(SMART_ACCOUNTS_ENABLED_KEY))
      : false,
  moduleManagementEnabled:
    typeof localStorage !== "undefined"
      ? Boolean(localStorage.getItem(MODULE_MANAGEMENT_ENABLED_KEY))
      : false,
});

/**
 * Store / Actions
 */
export const SettingsStore = {
  state,

  setAccount(value: number) {
    state.account = value;
  },

  setPairings(pairings: PairingTypes.Struct[]) {
    state.pairings = pairings;
  },

  setRelayerRegionURL(relayerRegionURL: string) {
    state.relayerRegionURL = relayerRegionURL;
  },

  setTezosAddress(tezosAddress: string) {
    state.tezosAddress = tezosAddress;
  },

  setActiveChainId(value: string) {
    state.activeChainId = value;
  },

  setCurrentRequestVerifyContext(context: Verify.Context) {
    state.currentRequestVerifyContext = context;
  },
  setSessions(sessions: SessionTypes.Struct[]) {
    state.sessions = sessions;
  },

  toggleTestNets() {
    state.testNets = !state.testNets;
    if (state.testNets) {
      state.smartAccountSponsorshipEnabled = true;
      localStorage.setItem(TEST_NETS_ENABLED_KEY, "YES");
    } else {
      state.smartAccountSponsorshipEnabled = false;
      localStorage.removeItem(TEST_NETS_ENABLED_KEY);
    }
  },

  toggleSmartAccountSponsorship() {
    if (!state.testNets) {
      return;
    }
    state.smartAccountSponsorshipEnabled = !state.smartAccountSponsorshipEnabled;
  },

  toggleSmartAccountEnabled() {
    state.smartAccountEnabled = !state.smartAccountEnabled;
    if (state.smartAccountEnabled) {
      localStorage.setItem(SMART_ACCOUNTS_ENABLED_KEY, "YES");
    } else {
      localStorage.removeItem(SMART_ACCOUNTS_ENABLED_KEY);
    }
  },
  toggleModuleManagement() {
    state.moduleManagementEnabled = !state.moduleManagementEnabled;
    if (state.moduleManagementEnabled) {
      localStorage.setItem(MODULE_MANAGEMENT_ENABLED_KEY, "YES");
    } else {
      localStorage.removeItem(MODULE_MANAGEMENT_ENABLED_KEY);
    }
  },
};
