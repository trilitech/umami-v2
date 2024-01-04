import { Address } from "../types/Address";
import { RawTokenBalance } from "../types/TokenBalance";

export const tzBtsc = (owner: Address): RawTokenBalance => {
  return {
    id: 25018298793985,
    account: {
      address: owner.pkh,
    },
    token: {
      id: 24975299837953,
      contract: {
        alias: "tzBTC",
        address: "KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
      },
      tokenId: "0",
      standard: "fa1.2",
      totalSupply: "107615636205",
      metadata: {
        name: "tzBTC",
        symbol: "tzBTC",
        decimals: "8",
      },
    },
    balance: "2205",
    transfersCount: 68,
    firstLevel: 890534,
    firstTime: "2020-04-01T14:11:25Z",
    lastLevel: 3028779,
    lastTime: "2023-01-04T17:57:29Z",
  };
};

export const hedgehoge = (owner: Address): RawTokenBalance => {
  return {
    id: 53252621074433,
    account: {
      address: owner.pkh,
    },
    token: {
      id: 53248292552705,
      contract: {
        alias: "Hedgehoge",
        address: "KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9",
      },
      tokenId: "0",
      standard: "fa1.2",
      totalSupply: "42000000000000",
      metadata: {
        icon: "ipfs://QmXL3FZ5kcwXC8mdwkS1iCHS2qVoyg69ugBhU2ap8z1zcs",
        name: "Hedgehoge",
        symbol: "HEH",
        decimals: "6",
      },
    },
    balance: "10000000000",
    transfersCount: 1,
    firstLevel: 1477579,
    firstTime: "2021-05-19T01:09:54Z",
    lastLevel: 1477579,
    lastTime: "2021-05-19T01:09:54Z",
  };
};
