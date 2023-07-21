import { Estimate } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { estimateBatch, estimateMultisigPropose } from "../../../utils/tezos";
import { sumEstimations } from "../../../views/batch/batchUtils";
import { FormOperations, ProposalOperations } from "../types";

const makeMultisigProposalSimulation = async (
  operation: ProposalOperations,
  network: TezosNetwork,
  getPk: (pkh: string) => string
) => {
  const content = operation.content;
  const signerPk = getPk(operation.signer.pkh);
  const signerPkh = operation.signer;
  const multisigContract = parseContractPkh(operation.sender.pkh);

  const lambdaActions = makeBatchLambda(content);
  const result = await estimateMultisigPropose(
    {
      lambdaActions,
      contract: multisigContract,
    },

    signerPk,
    signerPkh.pkh,
    network
  );
  return result;
};

const getTotalFee = (estimate: Estimate[] | Estimate) =>
  String(Array.isArray(estimate) ? sumEstimations(estimate) : estimate.totalCost);

export const makeSimulation = async (
  operation: FormOperations,
  getPk: (pkh: string) => string,
  network: TezosNetwork
) => {
  if (operation.type === "proposal") {
    return makeMultisigProposalSimulation(operation, network, getPk).then(getTotalFee);
  }
  const implicitOps = operation.content;
  const sender = operation.signer;

  const pk = getPk(sender.pkh);
  return estimateBatch(implicitOps, sender.pkh, pk, network).then(getTotalFee);
};
