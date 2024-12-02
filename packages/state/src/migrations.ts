import { getNetworksForContracts } from "@umami/multisig";
import { isValidContractPkh, isValidImplicitPkh } from "@umami/tezos";
import { produce } from "immer";
import { fromPairs, identity } from "lodash";

import { announcementInitialState as announcementsInitialState } from "./slices/announcement";

export const VERSION = 9;

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
  6: async (state: any) => {
    const implicitAccounts = Object.values(state.contacts)
      .filter((contact: any) => isValidImplicitPkh(contact.pkh))
      .map((contact: any) => [contact.pkh, { ...contact, network: undefined }]);

    const contractPkhs = Object.values(state.contacts)
      .filter((contact: any) => isValidContractPkh(contact.pkh))
      .map((contact: any) => contact.pkh);

    const contractsWithNetworks = await getNetworksForContracts(
      state.networks.available,
      contractPkhs
    );
    const contractAccounts = [...contractsWithNetworks.entries()].map(([pkh, network]) => [
      pkh,
      { ...state.contacts[pkh], network },
    ]);

    return produce(state, (draft: any) => {
      draft.contacts = fromPairs([...implicitAccounts, ...contractAccounts]);
    });
  },
  7: (state: any) =>
    produce(state, (draft: any) => {
      draft.assets.accountStates = {};
      draft.assets.block = { level: draft.assets.blockLevel };
      delete draft.assets["blockLevel"];
      delete draft.assets["balances"];
      delete draft.assets["delegationLevels"];
    }),
  8: identity,
  9: (state: any) =>
    produce(state, (draft: any) => {
      if (draft.networks.current.name === "mainnet") {
        draft.networks.current.rpcUrl = "https://mainnet.ecadinfra.com";
      }
      for (const network of draft.networks.available) {
        if (network.name === "mainnet") {
          network.rpcUrl = "https://mainnet.ecadinfra.com";
          break;
        }
      }
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
  3: identity,
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
  6: identity,
  7: identity,
  8: (state: any) =>
    produce(state, (draft: any) => {
      draft.items.forEach((account: any) => {
        if (account.type === "mnemonic") {
          account.isVerified = true;
        }
      });
    }),
  9: identity,
} as any;
