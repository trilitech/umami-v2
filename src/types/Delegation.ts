import { BigNumber } from "bignumber.js";

import { DelegationOperation } from "../utils/tezos";

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

export const makeDelegation = (op: DelegationOperation): Delegation | null => {
  if (!op.newDelegate) {
    return null;
  }

  return {
    sender: op.sender.address,
    timestamp: op.timestamp,
    id: op.id,
    amount: new BigNumber(op.amount),
    delegate: {
      address: op.newDelegate.address,
      alias: op.newDelegate.alias ?? undefined,
    },
  };
};
