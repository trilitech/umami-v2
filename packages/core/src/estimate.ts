import { type Estimate } from "@taquito/taquito";
import { type Estimation, type Network, isAccountRevealed, makeToolkit } from "@umami/tezos";

import { type AccountOperations, type EstimatedAccountOperations } from "./AccountOperations";
import { operationsToBatchParams } from "./helpers";
import { CustomError } from "../../utils/src/ErrorContext";

/**
 * Estimates (and simulates the execution of) the operations.
 *
 * @param operations - operations to be estimated with a particular transaction signer
 * @param network -
 * @returns operations with their estimated fees, gas and storage limits
 */
export const estimate = async (
  operations: AccountOperations,
  network: Network
): Promise<EstimatedAccountOperations> => {
  const tezosToolkit = await makeToolkit({
    type: "fake",
    signer: operations.signer,
    network,
  });
  try {
    const estimates = await tezosToolkit.estimate.batch(operationsToBatchParams(operations));

    let revealEstimate = undefined;
    // taquito automatically adds a reveal operation (sometimes)
    // if an account is not revealed yet
    if (estimates.length > operations.operations.length) {
      revealEstimate = estimateToEstimation(estimates.shift()!);
    }

    return {
      ...operations,
      estimates: estimates.map(estimateToEstimation),
      revealEstimate,
    };
  } catch (err: any) {
    const isRevealed = await isAccountRevealed(operations.signer.address.pkh, network);

    if (!isRevealed) {
      throw new CustomError(`Signer address is not revealed on the ${network.name}.`);
    }

    throw err;
  }
};

const estimateToEstimation = (estimate: Estimate): Estimation => ({
  storageLimit: estimate.storageLimit,
  gasLimit: estimate.gasLimit,
  // The way taquito works we need to take the max of suggestedFeeMutez and totalCost
  // because the suggestedFeeMutez does not include the storage & execution cost
  // and in these cases the totalCost is the one to go (so, for contract calls)
  // though totalCost doesn't work well with simple tez transfers and suggestedFeeMutez is more accurate
  fee: Math.max(estimate.suggestedFeeMutez, estimate.totalCost),
});
