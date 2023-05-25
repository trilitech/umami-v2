import { DelegationOperation } from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";

export type Delegation = {
  sender: string;
  timestamp: string;
  id: number;
  amount: BigNumber;
  delegate: {
    address: string;
    alias?: string;
  };
};

export const makeDelegation = (op?: DelegationOperation): Delegation | null => {
  if (!op) {
    return null;
  }
  const senderAddress = op.sender?.address;
  const delegateAddress = op.newDelegate?.address;
  const timestamp = op.timestamp;
  const id = op.id;
  const amount = op.amount;
  if (
    senderAddress == null ||
    delegateAddress == null ||
    timestamp == null ||
    id == null ||
    amount == null
  ) {
    return null;
  }

  return {
    sender: senderAddress,
    timestamp: timestamp,
    id,
    amount: new BigNumber(amount),
    delegate: {
      address: delegateAddress,
      alias: op.newDelegate?.alias || undefined,
    },
  };
};
