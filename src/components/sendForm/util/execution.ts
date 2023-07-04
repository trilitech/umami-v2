import { TezosNetwork } from "@airgap/tezos";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { SignerConfig } from "../../../types/SignerConfig";
import {
  approveOrExecuteMultisigOperation,
  proposeMultisigLambda,
  submitBatch,
} from "../../../utils/tezos";
import { MultisigApproveOrExecuteMethodArgs } from "../../../utils/tezos/types";
import { FormOperations, ApproveOrExecuteOperations, OperationValue } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeProposeOperation = async (operations: OperationValue[], config: SignerConfig) => {
  const lambdaActions = await makeBatchLambda(
    operations.map(toLambdaOperation),
    TezosNetwork.GHOSTNET
  );
  const contract = parseContractPkh(operations[0].value.sender);

  return proposeMultisigLambda({ contract, lambdaActions }, config);
};

const makeApproveOrExecute = (op: ApproveOrExecuteOperations, config: SignerConfig) => {
  const params: MultisigApproveOrExecuteMethodArgs = {
    contract: { type: "contract", pkh: op.content[0].value.sender },
    operationId: op.operationId,
    type: op.type,
  };
  return approveOrExecuteMultisigOperation(params, config);
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

  if (op.type === "proposal") {
    return makeProposeOperation(transferToDisplay, config);
  }

  if (op.type === "execute" || op.type === "approve") {
    return makeApproveOrExecute(op, config);
  }
  return makeTransferImplicit(transferToDisplay, config);
};
