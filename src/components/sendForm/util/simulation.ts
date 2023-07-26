import { Estimate } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { ImplicitAccount } from "../../../types/Account";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { estimateBatch, estimateMultisigPropose } from "../../../utils/tezos";
import { sumEstimations } from "../../../views/batch/batchUtils";
import { FormOperations, ProposalOperations } from "../types";

const makeMultisigProposalSimulation = async (
  operation: ProposalOperations,
  network: TezosNetwork,
  signer: ImplicitAccount
) => {
  const content = operation.content;

  const lambdaActions = makeBatchLambda(content);
  const result = await estimateMultisigPropose(
    {
      lambdaActions,
      contract: operation.sender.address,
    },

    signer,
    network
  );
  return result;
};

// TODO: uncouple and split into two inlined functions
const getTotalFee = (estimate: Estimate[] | Estimate) =>
  String(Array.isArray(estimate) ? sumEstimations(estimate) : estimate.suggestedFeeMutez);

export const makeSimulation = async (operation: FormOperations, network: TezosNetwork) => {
  if (operation.type === "proposal") {
    return makeMultisigProposalSimulation(operation, network, operation.signer).then(getTotalFee);
  }
  const implicitOps = operation.content;

  return estimateBatch(implicitOps, operation.signer, network).then(getTotalFee);
};
