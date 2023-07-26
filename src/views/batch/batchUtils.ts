import { BigNumber } from "bignumber.js";
import { Estimate } from "@taquito/taquito";
import { estimateBatch } from "../../utils/tezos";
import { zip } from "../../utils/helpers";
import { Operation } from "../../types/Operation";
import { TezosNetwork } from "../../types/TezosNetwork";
import { BatchItem } from "../../utils/redux/slices/assetsSlice";
import { ImplicitAccount } from "../../types/Account";

export const getTotalFee = (items: BatchItem[]): BigNumber => {
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
) => {
  // TODO: add support for Multisig
  const estimations = await estimateBatch(operations, signer, network);

  return zip(operations, estimations).map(([operation, estimate]) => {
    return {
      fee: String(estimate.suggestedFeeMutez),
      operation,
    };
  });
};
