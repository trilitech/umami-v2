import { type RawTzktTezTransfer } from "@umami/tzkt";

export const mockTzktTezTransfer = (
  sender: string,
  recipient: string,
  amount: number,
  timestamp = "2020-05-24T13:12:18Z",
  hash = "onqKcUZLbN9LdoJsPeRtDrHqYibm4osdtQJmGGQ4GAg3SjQUMT3",
  level = 10
): RawTzktTezTransfer =>
  ({
    id: 12345,
    type: "transaction",
    sender: { address: sender },
    target: { address: recipient },
    timestamp: timestamp,
    amount,
    hash,
    level,
    transactionId: 54321,
  }) as RawTzktTezTransfer;
