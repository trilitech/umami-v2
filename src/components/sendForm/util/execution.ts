import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { SignerConfig } from "../../../types/SignerConfig";
import { proposeMultisigLambda, submitBatch } from "../../../utils/tezos";
import { FormOperations, OperationValue } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeProposeOperation = async (
  operations: OperationValue[],
  sender: string,
  config: SignerConfig
) => {
  const lambdaActions = makeBatchLambda(operations.map(toLambdaOperation));
  const contract = parseContractPkh(sender);

  return proposeMultisigLambda({ contract, lambdaActions }, config);
};
const makeTransferImplicit = async (operations: OperationValue[], config: SignerConfig) => {
  return submitBatch(operations, config).then(res => {
    return {
      hash: res.opHash,
    };
  });
};

export const makeTransfer = (op: FormOperations, config: SignerConfig) => {
  const transferToDisplay = op.content;

  const transfer =
    op.type === "proposal"
      ? makeProposeOperation(transferToDisplay, op.sender.pkh, config)
      : makeTransferImplicit(transferToDisplay, config);

  return transfer;
};
