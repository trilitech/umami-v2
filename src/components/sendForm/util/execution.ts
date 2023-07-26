import { TezosToolkit } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { ImplicitAccount, MultisigAccount } from "../../../types/Account";
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

const makeTransferImplicit = async (
  operations: Operation[],
  sender: ImplicitAccount,
  tezosToolkit: TezosToolkit
) => {
  return submitBatch(operations, sender, tezosToolkit).then(({ opHash }) => ({ hash: opHash }));
};

export const makeTransfer = (op: FormOperations, tezosToolkit: TezosToolkit) => {
  const transferToDisplay = op.content;

  const transfer =
    op.type === "proposal"
      ? makeProposeOperation(transferToDisplay, op.sender, tezosToolkit)
      : makeTransferImplicit(transferToDisplay, op.signer, tezosToolkit);

  return transfer;
};
