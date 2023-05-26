import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { Subtotal, TransactionsAmount } from "../components/TezAmountRecaps";
import { OperationValue } from "../types";

export const BatchRecap = ({ transfer }: { transfer: OperationValue[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal mutez={getBatchSubtotal(transfer).toString()} />
    </>
  );
};
