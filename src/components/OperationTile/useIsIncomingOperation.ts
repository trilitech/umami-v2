import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { TransactionOperation } from "../../utils/tezos";

export const useIsIncomingOperation = (operation: TransactionOperation) => {
  const ownedAccounts = useAllAccounts();

  return ownedAccounts.map(acc => acc.address.pkh).includes(operation.target?.address as string);
};
