import { useIsOwnedAddress } from "@umami/state";
import {
  type DelegationOperation,
  type FinalizeUnstakeOperation,
  type OriginationOperation,
  type StakeOperation,
  type TransactionOperation,
  type UnstakeOperation,
} from "@umami/tzkt";
import { BigNumber } from "bignumber.js";
import { get } from "lodash";

const FEE_FIELDS = ["bakerFee", "storageFee", "allocationFee"] as const;

type SupportedOperation =
  | TransactionOperation
  | DelegationOperation
  | OriginationOperation
  | StakeOperation
  | UnstakeOperation
  | FinalizeUnstakeOperation;

/**
 * This hook calculates the total fee of an operation that a user paid for it.
 * if the operation is _incoming_ then the fee is null
 * if, for some reason, the total fee is 0, then the fee is null
 *
 * @param operation -
 * @param senderAddress -
 */
export const useFee = (operation?: SupportedOperation): null | string => {
  const isOutgoing = useIsOwnedAddress()(operation?.sender.address);

  if (!operation || !isOutgoing) {
    return null;
  }

  const totalFee = FEE_FIELDS.reduce((acc, curr) => {
    if (curr in operation) {
      return acc.plus(get(operation, curr) || 0);
    }

    return acc;
  }, BigNumber(0));

  return totalFee.eq(0) ? null : totalFee.toString();
};
