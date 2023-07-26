import { ApproveOrExecute } from "../../utils/tezos/types";
import { MultisigOperation } from "../../utils/multisig/types";
import { ImplicitAccount, MultisigAccount } from "../../types/Account";

export type ParamsWithFee = ApproveExecuteParams & { suggestedFeeMutez: number };

export type ApproveExecuteParams = {
  type: ApproveOrExecute;
  operation: MultisigOperation;
  signer: ImplicitAccount;
  sender: MultisigAccount;
};
