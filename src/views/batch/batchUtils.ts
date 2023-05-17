import { OperationValue } from "../../components/sendForm/types";
import { BatchItem } from "../../utils/store/assetsSlice";
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../../utils/format";

export const getTotalFeeInTez = (items: BatchItem[]): BigNumber => {
  const fee = items.reduce((acc, curr) => {
    return acc.plus(curr.fee);
  }, new BigNumber(0));

  return fee;
};

export const getBatchSubtotalInTez = (ops: OperationValue[]) => {
  const subTotal = ops.reduce((acc, curr) => {
    switch (curr.type) {
      case "tez":
        return acc.plus(curr.value.amount);
      default:
        return acc;
    }
  }, new BigNumber(0));
  return mutezToTez(subTotal);
};
