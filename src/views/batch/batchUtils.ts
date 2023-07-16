import { OperationValue } from "../../components/sendForm/types";
import { BatchItem } from "../../utils/store/assetsSlice";
import { BigNumber } from "bignumber.js";
import { Estimate } from "@taquito/taquito";
import { estimateBatch } from "../../utils/tezos";
import { zip } from "../../utils/helpers";
import { FakeToolkitConfig } from "../../types/ToolkitConfig";

export const getTotalFee = (items: BatchItem[]): BigNumber => {
  const fee = items.reduce((acc, curr) => {
    return acc.plus(curr.fee);
  }, new BigNumber(0));

  return fee;
};

export const getBatchSubtotal = (ops: OperationValue[]) => {
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

export const estimateFeeForEachOperation = async (
  operations: OperationValue[],
  config: FakeToolkitConfig
) => {
  const estimations = await estimateBatch(operations, config);
  const items = zip(operations, estimations).map(([o, e]) => {
    return {
      fee: String(e.suggestedFeeMutez),
      operation: o,
    };
  });
  return items;
};
