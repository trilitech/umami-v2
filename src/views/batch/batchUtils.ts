import { BigNumber } from "bignumber.js";
import { Estimate } from "@taquito/taquito";
import { estimateBatch } from "../../utils/tezos";
import { zip } from "lodash";
import { Operation, OperationWithFee } from "../../types/Operation";
import { TezosNetwork } from "../../types/TezosNetwork";
import { ImplicitAccount } from "../../types/Account";

export const getTotalFee = (items: OperationWithFee[]): BigNumber => {
  const fee = items.reduce((acc, curr) => {
    return acc.plus(curr.fee);
  }, new BigNumber(0));

  return fee;
};

export const getBatchSubtotal = (ops: Operation[]) => {
  const subTotal = ops.reduce((acc, curr) => {
    switch (curr.type) {
      case "tez":
        return acc.plus(new BigNumber(curr.amount));
      default:
        return acc;
    }
  }, new BigNumber(0));
  return subTotal;
};

export const sumEstimations = (es: Estimate[]) => {
  return es
    .reduce((acc, curr) => {
      return acc.plus(curr.suggestedFeeMutez);
    }, new BigNumber(0))
    .toNumber();
};

export const operationsToBatchItems = async (
  operations: Operation[],
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<OperationWithFee[]> => {
  // TODO: add support for Multisig
  const estimations = await estimateBatch(operations, signer, network);

  return zip(operations, estimations).map(([operation, estimate]) => {
    return {
      ...(operation as OperationWithFee), // operations.length is always >= estimations.length
      // The way taquito works we need to take the max of suggestedFeeMutez and totalCost
      // because the suggestedFeeMutez does not include the storage & execution cost
      // and in these cases the totalCost is the one to go (so, for contract calls)
      // though totalCost doesn't work well with simple tez transfers and suggestedFeeMutez is more accurate
      //
      // multisig operations cannot be estimated as implicit ones and what we have is
      // just one estimate for the whole batch (the contract call fee)
      // to make it at least show the correct totalFee we assign the fee as the first operation's fee
      // TODO: fix this and handle multisig and implicit operations separately
      fee: String(Math.max(estimate?.suggestedFeeMutez || 0, estimate?.totalCost || 0)),
    };
  });
};
