import { TezosToolkit } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { MultisigAccount } from "../../../types/Account";
import { Operation } from "../../../types/Operation";
import { proposeMultisigLambda, submitBatch } from "../../../utils/tezos";
import { FormOperations } from "../types";

const makeProposeOperation = async (
  operations: Operation[],
  sender: MultisigAccount,
  tezosToolkit: TezosToolkit
) => {
  const lambdaActions = makeBatchLambda(operations);

  return proposeMultisigLambda({ contract: sender.address, lambdaActions }, tezosToolkit);
};

const makeTransferImplicit = async (operations: Operation[], tezosToolkit: TezosToolkit) => {
  return submitBatch(operations, tezosToolkit).then(({ opHash }) => ({ hash: opHash }));
};

export const makeTransfer = (op: FormOperations, tezosToolkit: TezosToolkit) => {
  const transferToDisplay = op.content;

  const transfer =
    op.type === "proposal"
      ? makeProposeOperation(transferToDisplay, op.sender, tezosToolkit)
      : makeTransferImplicit(transferToDisplay, tezosToolkit);

  return transfer;
};
