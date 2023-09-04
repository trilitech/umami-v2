import { AccountOperations } from "../../components/sendForm/types";
import { TezosNetwork } from "../../types/TezosNetwork";
import { makeToolkit, operationsToBatchParams, sumTez } from "./helpers";
import BigNumber from "bignumber.js";

export const estimate = async (
  { operations, signer }: AccountOperations,
  network: TezosNetwork
): Promise<BigNumber> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer: signer, network });

  const estimations = await tezosToolkit.estimate.batch(operationsToBatchParams(operations));
  // The way taquito works we need to take the max of suggestedFeeMutez and totalCost
  // because the suggestedFeeMutez does not include the storage & execution cost
  // and in these cases the totalCost is the one to go (so, for contract calls)
  // though totalCost doesn't work well with simple tez transfers and suggestedFeeMutez is more accurate
  return sumTez(
    estimations.map(estimate => Math.max(estimate.suggestedFeeMutez, estimate.totalCost).toString())
  );
};
