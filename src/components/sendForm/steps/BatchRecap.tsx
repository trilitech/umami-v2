import { Operation } from "../../../types/Operation";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { Subtotal, TransactionsAmount } from "../components/TezAmountRecaps";

export const BatchRecap = ({ transfer }: { transfer: Operation[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal mutez={getBatchSubtotal(transfer).toString()} />
    </>
  );
};
