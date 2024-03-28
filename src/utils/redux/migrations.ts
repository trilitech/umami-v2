/* istanbul ignore file */
import { produce } from "immer";
import { fromPairs, identity } from "lodash";

import { initialState as announcementsInitialState } from "./slices/announcementSlice";
import { isValidContractPkh, isValidImplicitPkh } from "../../types/Address";
import { getNetworksForContracts } from "../multisig/helpers";

export const VERSION = 3;

export const mainStoreMigrations = {
  0: (state: any) =>
    produce(state, (draft: any) => {
      draft.multisigs.labelsMap = {};
    }),
  1: (state: any) =>
    produce(state, (draft: any) => {
      draft.announcement = announcementsInitialState;
    }),
  2: identity,
  3: (state: any) =>
    produce(state, (draft: any) => {
      if (draft.networks.current.name === "ghostnet") {
        draft.networks.current.buyTezUrl = "https://faucet.ghostnet.teztnets.com/";
      }
      for (const network of draft.networks.available) {
        if (network.name === "ghostnet") {
          network.buyTezUrl = "https://faucet.ghostnet.teztnets.com/";
          break;
        }
      }
    }),
  4: async (state: any) => {
    const implicitAccounts = Object.values(state.contacts)
      .filter((contact: any) => isValidImplicitPkh(contact.pkh))
      .map((contact: any) => [contact.pkh, { ...contact, network: undefined }]);
    console.log(implicitAccounts);

    const contractPkhs = Object.values(state.contacts)
      .filter((contact: any) => isValidContractPkh(contact.pkh))
      .map((contact: any) => contact.pkh);
    console.log(contractPkhs);
    const contractsWithNetworks = await getNetworksForContracts(
      state.networks.available,
      new Set(contractPkhs)
    );
    console.log(contractsWithNetworks);
    const contractAccounts = [...contractsWithNetworks.entries()].map(([pkh, network]) => [
      pkh,
      { ...state.contacts[pkh], network },
    ]);

    return produce(state, (draft: any) => {
      draft.contacts = fromPairs([...implicitAccounts, ...contractAccounts]);
    });
  },
} as any;

export const accountsMigrations = {
  0: identity,
  1: identity,
  2: (state: any) =>
    produce(state, (draft: any) => {
      draft.items.forEach((account: any) => {
        if (account.type === "secret_key") {
          account.curve = "ed25519";
        }
      });
    }),
  3: identity,
  //4: identity,
} as any;
