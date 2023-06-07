import { MultisigOperation } from "../utils/multisig/types";
import { AccountType } from "./Account";

export type MultisigAccount = {
  type: AccountType.MULTISIG;
  pkh: string;
  label: string;
  proposals: MultisigOperation[];
};
