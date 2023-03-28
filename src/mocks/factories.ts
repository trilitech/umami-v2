import { Account } from "../types/Account";
import { TezTransfer, TokenTransfer } from "../types/Operation";
import { UmamiEncrypted } from "../types/UmamiEncrypted";

export const mockTezTransaction = (id: number) => {
  return {
    sender: { address: `mockSender${id}` },
    target: { address: `mockTarget${id}` },
  } as TezTransfer;
};

export const mockTokenTransaction = (id: number) => {
  return {
    from: { address: `mockSender${id}` },
    to: { address: `mockTarget${id}` },
  } as TokenTransfer;
};

export const mockPkh = (index: number) =>
  `tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3x${index}`;

export const mockAccountLabel = (index: number) => `account ${index}`;

export const mockPk = (index: number) =>
  `edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H${index}`;

export const mockAccount = (index: number): Account => {
  return {
    label: mockAccountLabel(index),
    pkh: mockPkh(index),
    pk: mockPk(index),
    esk: {} as UmamiEncrypted,
  };
};
