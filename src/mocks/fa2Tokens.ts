import { Address } from "../types/Address";
import { RawTokenBalance } from "../types/TokenBalance";

export const uUSD = (owner: Address): RawTokenBalance => {
  return {
    id: 64166129827842,
    account: {
      address: owner.pkh,
    },
    token: {
      id: 64166129827841,
      contract: {
        address: "KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo",
      },
      tokenId: "0",
      standard: "fa2",
      totalSupply: "55000413808",
      lastLevel: undefined,
      metadata: {
        name: "youves uUSD",
        symbol: "uUSD",
        decimals: "12",
        thumbnailUri: "ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd",
        shouldPreferSymbol: true,
      },
    },
    balance: "19218750000",
    transfersCount: 3,
    firstLevel: 1566786,
    firstTime: "2021-07-21T12:05:58Z",
    lastLevel: 1566979,
    lastTime: "2021-07-21T15:18:58Z",
  };
};
