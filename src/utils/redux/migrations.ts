import { produce } from "immer";
import { fromPairs, identity } from "lodash";

import { initialState as announcementsInitialState } from "./slices/announcementSlice";
import { isValidContractPkh, isValidImplicitPkh } from "../../types/Address";
import { useGetNetworksForContracts } from "../multisig/helpers";

export const VERSION = 6;

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
  4: identity,
  5: (state: any) =>
    produce(state, (draft: any) => {
      delete draft.assets.transfers["tez"];
    }),
  6: (state: any) =>
    produce(state, async (draft: any) => {
      const getNetworksForContracts = useGetNetworksForContracts();

      const implicitAccounts = Object.values(draft.contacts)
        .filter((contact: any) => isValidImplicitPkh(contact.pkh))
        .map((contact: any) => [contact.pkh, { ...contact, network: undefined }]);
      const contractPkhs = Object.values(draft.contacts)
        .filter((contact: any) => isValidContractPkh(contact.pkh))
        .map((contact: any) => contact.pkh);
      const contractsWithNetworks = await getNetworksForContracts(new Set(contractPkhs));
      const contractAccounts = [...contractsWithNetworks.entries()].map(([pkh, network]) => [
        pkh,
        { ...draft.contacts[pkh], network },
      ]);
      draft.contacts = fromPairs([...implicitAccounts, ...contractAccounts]);
    }),
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
  4: (state: any) =>
    produce(state, (draft: any) => {
      draft.items.forEach((account: any) => {
        if (account.type === "ledger" && !account.derivationPathTemplate) {
          account.derivationPathTemplate = undefined;

          if (account.derivationPath === "44'/1729'/0'/0'") {
            account.derivationPathTemplate = "44'/1729'/?'/0'";
          } else if (account.derivationPath === "44'/1729'/0'/0'/0'") {
            account.derivationPathTemplate = "44'/1729'/?'/0'/0'";
          }
        }
      });
    }),
  5: identity,
} as any;
