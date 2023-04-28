import { OperationValue } from "../../components/sendForm/types";
import { BatchItem } from "../../utils/store/assetsSlice";

export const getTotalFee = (items: BatchItem[]) => {
  const fee = items.reduce((acc, curr) => {
    return acc + curr.fee;
  }, 0);

  return fee;
};

export const getBatchSubtotal = (ops: OperationValue[]) => {
  const subTotal = ops.reduce((acc, curr) => {
    switch (curr.type) {
      case "tez":
        return acc + curr.value.amount;
      default:
        return acc;
    }
  }, 0);
  return subTotal;
};
