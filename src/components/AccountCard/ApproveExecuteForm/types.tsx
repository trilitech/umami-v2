import { ApproveOrExecute } from "../../../utils/tezos/types";
import { MultisigOperation } from "../../../utils/multisig/types";
import { ContractAddress, ImplicitAddress } from "../../../types/Address";

export type ParamsWithFee = ApproveExecuteParams & { suggestedFeeMutez: number };

export type ApproveExecuteParams = {
  type: ApproveOrExecute;
  operation: MultisigOperation;
  signer: ImplicitAddress;
  multisigAddress: ContractAddress;
};
