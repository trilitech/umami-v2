import { DelegationOperation } from "@tzkt/sdk-api";

const MOCK_TIMESTAMP = "2020-05-24T13:12:18Z";

export const mockDelegationOperation = (
  senderPkh: string,
  delegatePkh: string,
  mutezDelegated: number
) => {
  return {
    type: "delegation",
    id: 9,
    sender: { address: senderPkh },
    newDelegate: { address: delegatePkh },
    timestamp: MOCK_TIMESTAMP,
    amount: mutezDelegated,
    hash: "mockHash",
    level: 3,
    bakerFee: 3,
  } as DelegationOperation;
};
