import { TezosNetwork } from "@airgap/tezos";
import { compact } from "lodash";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { getAllMultiSigContracts, getPendingOperations } from "./fetch";
import { WalletAccountPkh, MultisigWithPendingOperations, AccountToMultisigs } from "./types";

export const buildAccountToMultisigsMap = (
  multisigs: MultisigWithPendingOperations[],
  accountPkhs: Set<WalletAccountPkh>
): AccountToMultisigs =>
  multisigs.reduce((acc: AccountToMultisigs, cur) => {
    const { signers } = cur;
    signers.forEach(signer => {
      if (accountPkhs.has(signer)) {
        acc[signer] = acc[signer] ?? [];
        acc[signer]?.push(cur);
      }
    });
    return acc;
  }, {});

export const getRelevantMultisigContracts = async (
  network: TezosNetwork,
  accountPkhs: Set<WalletAccountPkh>
): Promise<tzktGetSameMultisigsResponseType> => {
  const multisigs = await getAllMultiSigContracts(network);
  return multisigs.filter(({ storage: { signers } }) => {
    const intersection = signers.filter(s => accountPkhs.has(s));
    return intersection.length > 0;
  });
};

export const getOperationsForMultisigs = async (
  network: TezosNetwork,
  multisigs: tzktGetSameMultisigsResponseType
): Promise<MultisigWithPendingOperations[]> => {
  const multisigsWithOperations = await Promise.all(
    multisigs.map(async ({ address, balance, storage: { signers, pending_ops, threshold } }) => {
      const response = await getPendingOperations(network, pending_ops);

      const operations = response.map(({ key, value }) => {
        if (!value || !key) {
          return null;
        }
        return {
          key,
          rawActions: value.actions,
          approvals: value.approvals,
        };
      });

      return {
        address,
        threshold: Number(threshold),
        signers,
        balance: balance.toString(),
        pendingOperations: compact(operations),
      };
    })
  );

  return multisigsWithOperations;
};
