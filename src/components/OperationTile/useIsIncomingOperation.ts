import { RawPkh } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";

export const useIsIncomingOperation = (target: RawPkh) => {
  const ownedAccounts = useAllAccounts();

  return ownedAccounts.map(acc => acc.address.pkh).includes(target);
};
