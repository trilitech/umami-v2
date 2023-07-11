import { RawOperation } from "../../../types/RawOperation";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { Subtotal, TransactionsAmount } from "../components/TezAmountRecaps";

export const BatchRecap = ({ transfer }: { transfer: RawOperation[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal mutez={getBatchSubtotal(transfer).toString()} />
    </>
  );
};
