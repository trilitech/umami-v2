import { AccountOperations } from "../../types/AccountOperations";
import { Network } from "../../types/Network";
import { makeToolkit, operationsToBatchParams, sumTez } from "./helpers";
import BigNumber from "bignumber.js";

export const estimate = async (
  operations: AccountOperations,
  network: Network
): Promise<BigNumber> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer: operations.signer, network });
  try {
    const estimations = await tezosToolkit.estimate.batch(operationsToBatchParams(operations));
    // The way taquito works we need to take the max of suggestedFeeMutez and totalCost
    // because the suggestedFeeMutez does not include the storage & execution cost
    // and in these cases the totalCost is the one to go (so, for contract calls)
    // though totalCost doesn't work well with simple tez transfers and suggestedFeeMutez is more accurate
    return sumTez(
      estimations.map(estimate =>
        Math.max(estimate.suggestedFeeMutez, estimate.totalCost).toString()
      )
    );
  } catch (err: any) {
    throw new Error(handleTezError(err));
  }
};

// Converts a known L1 error message to a more user-friendly one
const handleTezError = (err: any): string | any => {
  let message = "";

  if (err.message.includes("subtraction_underflow")) {
    message = "Insufficient balance, please make sure you have enough funds.";
  } else if (err.message.includes("contract.non_existing_contract")) {
    message = "Contract does not exist, please check if the correct network is selected.";
  }

  return message ? message : err;
};
