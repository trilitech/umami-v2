import { useIsBlockFinalised } from "@umami/state";
import { type OperationStatus as TzktOperationStatus } from "@umami/tzkt";

export type OperationStatus = "applied" | "pending" | "failed";

/**
 * @param level - current block level
 * @param status -
 * @returns operation's status to be displayed in the operation's tile
 */
export const useOperationStatus = (
  level: number,
  status: TzktOperationStatus | undefined
): OperationStatus => {
  const isFinalised = useIsBlockFinalised(level);

  // if we don't know the status we assume it's applied
  const isApplied = status === "applied" || !status;
  return isApplied ? (isFinalised ? "applied" : "pending") : "failed";
};
