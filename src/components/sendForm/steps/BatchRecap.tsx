import { Operation } from "../../../types/Operation";
import { TransactionsAmount } from "../components/TezAmountRecaps";

export const BatchRecap = ({ transfer }: { transfer: Operation[] }) => {
  return <TransactionsAmount amount={transfer.length} />;
};
