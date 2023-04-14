import { TransactionValues } from "../../components/sendForm/types";
import { BatchItem } from "../../utils/store/assetsSlice";

export const getTotalFee = (items: BatchItem[]) => {
  const fee = items.reduce((acc, curr) => {
    return acc + curr.fee;
  }, 0);

  return fee;
};

export const getBatchSubtotal = (txs: TransactionValues[]) => {
  const subTotal = txs.reduce((acc, curr) => {
    if (curr.type === "tez") {
      return acc + curr.values.amount;
    } else {
      return acc;
    }
  }, 0);
  return subTotal;
};
