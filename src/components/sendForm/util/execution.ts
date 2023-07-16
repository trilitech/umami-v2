import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import {
  LedgerToolkitConfig,
  SecretkeyToolkitConfig,
  ToolkitConfig,
} from "../../../types/ToolkitConfig";
import { proposeMultisigLambda, submitBatch } from "../../../utils/tezos";
import { FormOperations, OperationValue } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeProposeOperation = async (
  operations: OperationValue[],
  sender: string,
  config: LedgerToolkitConfig | SecretkeyToolkitConfig
) => {
  const lambdaActions = makeBatchLambda(operations.map(toLambdaOperation));
  const contract = parseContractPkh(sender);

  return proposeMultisigLambda({ contract, lambdaActions }, config);
};
const makeTransferImplicit = async (operations: OperationValue[], config: ToolkitConfig) => {
  return submitBatch(operations, config).then(res => {
    return {
      hash: res.opHash,
    };
  });
};

export const makeTransfer = (
  op: FormOperations,
  config: LedgerToolkitConfig | SecretkeyToolkitConfig
) => {
  const transferToDisplay = op.content;

  const transfer =
    op.type === "proposal"
      ? makeProposeOperation(transferToDisplay, op.sender.pkh, config)
      : makeTransferImplicit(transferToDisplay, config);

  return transfer;
};
