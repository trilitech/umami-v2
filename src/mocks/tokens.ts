import type { FA12TokenBalance, FA2TokenBalance, NFTBalance } from "../types/TokenBalance";
import { nftDisplayUri } from "../utils/tezos/consts";

export const ghostTezzard: NFTBalance = {
  id: 1,
  type: "nft",
  contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
  tokenId: "6",
  balance: "1",
  displayUri: nftDisplayUri,
  totalSupply: "1",
  metadata: {
    displayUri: nftDisplayUri,
    name: "Tezzardz #24",
    symbol: "FKR",
  },
};

export const ghostFA12: FA12TokenBalance = {
  type: "fa1.2",
  contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
  tokenId: "0",
  balance: "1",
};

export const ghostFA2: FA2TokenBalance = {
  type: "fa2",
  contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
  tokenId: "1",
  balance: "1",
  metadata: {
    name: "Klondike3",
    symbol: "KL3",
    decimals: "5",
  },
};
