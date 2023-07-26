import { ApproveOrExecute } from "../../utils/tezos/types";
import { MultisigOperation } from "../../utils/multisig/types";
import { ContractAddress } from "../../types/Address";
import { ImplicitAccount } from "../../types/Account";

export type ParamsWithFee = ApproveExecuteParams & { suggestedFeeMutez: number };

export type ApproveExecuteParams = {
  type: ApproveOrExecute;
  operation: MultisigOperation;
  signer: ImplicitAccount;
  multisigAddress: ContractAddress;
};
