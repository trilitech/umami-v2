import { type Estimate } from "@taquito/taquito";

import { isAccountRevealed, makeToolkit, operationsToBatchParams } from "./helpers";
import { type Estimation } from "./types";
import {
  type AccountOperations,
  type EstimatedAccountOperations,
} from "../../types/AccountOperations";
import { type Network } from "../../types/Network";

/**
 * Estimates (and simulates the execution of) the operations.
 *
 * Note: if
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
      throw new Error(`Signer address is not revealed on the ${network.name}.`);
    }
    if (err instanceof Error) {
      err.message = handleTezError(err);
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

// Converts a known L1 error message to a more user-friendly one
export const handleTezError = (err: Error): string => {
  if (err.message.includes("subtraction_underflow")) {
    return "Insufficient balance, please make sure you have enough funds.";
  } else if (err.message.includes("contract.non_existing_contract")) {
    return "Contract does not exist, please check if the correct network is selected.";
  } else if (err.message.includes("staking_to_delegate_that_refuses_external_staking")) {
    return "The baker you are trying to stake to does not accept external staking.";
  }
  return err.message;
};
