import { useContext, useState } from "react";

import { prettyOperationType } from "./BatchView";
import { DynamicModalContext } from "../../components/DynamicModal";
import { SignPage } from "../../components/SendFlow/Batch/SignPage";
import colors from "../../style/colors";
import { AccountOperations } from "../../types/AccountOperations";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { estimate } from "../../utils/tezos";

// Converts from 1 => 1st, 2 => 2nd, 3 => 3rd... etc.
export const addOrdinal = (n: number): string => {
  let ordinal = "th";

  if (n % 10 == 1 && n % 100 != 11) {
    ordinal = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    ordinal = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    ordinal = "rd";
  }

  return `${n}${ordinal}`;
};

export type EstimateStatus = "Estimated" | "Failed" | "Not Estimated";

export const getEstimateStatusColor = (status: EstimateStatus) => {
  switch (status) {
    case "Estimated":
      return colors.green;
    case "Failed":
      return colors.orange;
    case "Not Estimated":
      return colors.orangeL;
  }
};

/**
 *
 * @param accountOperations: the batch of operations to be submitted.
 * @returns `onBatchSubmit`, `batchSubmitIsLoading`, `getEstimateStatus`.
 * `onBatchSubmit` is the function that is called when the user clicks the "Submit" button.
 * `batchSubmitIsLoading` is a boolean that is true when the batch is being submitted.
 * `getEstimateStatus` is a function that returns the status of the operation at the given index.
 */
const useOnBatchSubmit = (accountOperations: AccountOperations) => {
  const { openWith } = useContext(DynamicModalContext);

  const { handleAsyncAction, isLoading: batchSubmitIsLoading } = useAsyncActionHandler();
  const network = useSelectedNetwork();

  // `lastEstimatedIndex` is the index of the operation in the batch that failed during simulation.
  //  For example, if the the `lastEstimatedIndex` === accountOperations.operations.length,
  //  then the entire batch was estimated successfully.
  const [lastEstimatedIndex, setLastEstimatedIndex] = useState<null | number>(null);

  const getEstimateStatus = (index: number): EstimateStatus | null => {
    if (lastEstimatedIndex === null) {
      return null;
    }
    if (index < lastEstimatedIndex) {
      return "Estimated";
    } else if (index === lastEstimatedIndex) {
      return "Failed";
    }
    return "Not Estimated";
  };

  const onBatchSubmit = () =>
    handleAsyncAction(async () => {
      try {
        const initialFee = await estimate(accountOperations, network);
        setLastEstimatedIndex(accountOperations.operations.length);
        openWith(<SignPage initialFee={initialFee} initialOperations={accountOperations} />);
      } catch (_) {
        // TODO: handle case where each operation is valid but the batch is too large and gas is too high.

        const operations = accountOperations.operations;
        // In case of error, we identify the specific operation in the batch.
        for (let i = 0; i < operations.length; i += 1) {
          const operation = operations[i];
          try {
            await estimate({ ...accountOperations, operations: [operation] }, network);
          } catch (error: any) {
            const operationType = prettyOperationType(operation);
            setLastEstimatedIndex(i);
            throw new Error(
              `The ${addOrdinal(i + 1)} operation "${operationType}" is invalid: ${error.message}`
            );
          }
        }
      }
    });

  return { onBatchSubmit, batchSubmitIsLoading, getEstimateStatus };
};

export default useOnBatchSubmit;
