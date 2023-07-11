import { TezosNetwork } from "@airgap/tezos";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { Operation } from "../../../types/Operation";
import { SignerConfig } from "../../../types/SignerConfig";
import { proposeMultisigLambda, submitBatch } from "../../../utils/tezos";
import { FormOperations } from "../types";

const makeProposeOperation = async (
  operations: Operation[],
  sender: string,
  config: SignerConfig
) => {
  const lambdaActions = await makeBatchLambda(operations, TezosNetwork.GHOSTNET);
  const contract = parseContractPkh(sender);

  return proposeMultisigLambda({ contract, lambdaActions }, config);
};

const makeTransferImplicit = async (operations: Operation[], config: SignerConfig) => {
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
