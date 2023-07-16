import { TezosNetwork } from "@airgap/tezos";
import { Estimate } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { estimateBatch, estimateMultisigPropose } from "../../../utils/tezos";
import { sumEstimations } from "../../../views/batch/batchUtils";
import { FormOperations, ProposalOperations } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeMultisigProposalSimulation = async (
  operation: ProposalOperations,
  network: TezosNetwork,
  getPk: (pkh: string) => string
) => {
  const content = operation.content;
  const signerPk = getPk(operation.signer.pkh);
  const signerPkh = operation.signer;
  const multisigContract = parseContractPkh(operation.sender.pkh);

  const lambdaActions = makeBatchLambda(content.map(toLambdaOperation));
  const result = await estimateMultisigPropose(
    {
      lambdaActions,
      contract: multisigContract,
    },

    { type: "fake", pk: signerPk, pkh: signerPkh.pkh, network }
  );
  return result;
};

const getTotalFee = (estimate: Estimate[] | Estimate) =>
  String(Array.isArray(estimate) ? sumEstimations(estimate) : estimate.suggestedFeeMutez);

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
  return estimateBatch(implicitOps, { type: "fake", pkh: sender.pkh, pk, network }).then(
    getTotalFee
  );
};
