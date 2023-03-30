import { Account } from "../types/Account";
import { NFT } from "../types/Asset";
import { TezTransfer, TokenTransfer } from "../types/Operation";
import { Token } from "../types/Token";
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

const mockContract = (index: number) =>
  `KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob${index}`;

export const mockNFTToken = (
  index: number,
  pkh: string,
  balance: number = 1
) => {
  return {
    id: index,
    account: {
      address: pkh,
    },
    token: {
      id: 10899466223617,
      contract: {
        address: mockContract(index),
      },
      tokenId: "3",
      standard: "fa2",
      totalSupply: "1",
      metadata: {
        name: "Tezzardz #10",
        creators: ["George Goodwin (@omgidrawedit)"],
        decimals: "0",
        royalties: {
          shares: {
            tz1LLPWMyZ7gKsp3WnLfemyAYW6CoZoozku5: "5",
          },
          decimals: "2",
        },
        description:
          "Tezzardz is a collection of 4,200 programmatically, randomly generated, snazzy little fukrs on the Tezos blockchain.",
        displayUri: `ipfs://zb2rhXWQ9X95yxQwusNjftDSWVQYbGjFFFFBjJKQZ8uCrNcvV${index}`,
      },
    },
    balance: String(balance),
  } as Token;
};

export const mockNFT = (index: number, balance = "1"): NFT => {
  return {
    owner: mockPkh(index),
    balance,
    contract: mockContract(index),
    metadata: {
      displayUri:
        "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG" +
        index,
      name: "Tezzardz #" + index,
      symbol: "FKR" + index,
    },
    tokenId: "mockId" + index,
  };
};
