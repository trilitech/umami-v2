import { TezTransfer } from "../types/Transfer";

const MOCK_TIMESTAMP = "2020-05-24T13:12:18Z";
const MOCK_HASH = "onqKcUZLbN9LdoJsPeRtDrHqYibm4osdtQJmGGQ4GAg3SjQUMT3";
const MOCK_LEVEL = 10;
export const mockTzktTezTransfer = (
  sender: string,
  recipient: string,
  amount: number,
  timestamp = MOCK_TIMESTAMP,
  hash = MOCK_HASH,
  level = MOCK_LEVEL
): TezTransfer => {
  return {
    id: 12345,
    type: "transaction",
    sender: { address: sender },
    target: { address: recipient },
    timestamp: timestamp,
    amount,
    hash,
    level,
    transactionId: 54321,
  } as TezTransfer;
};
