import { FA12Token, FA2Token, NFT } from "../types/Asset";
import { publicKeys1 } from "./publicKeys";

export const ghostTezzard: NFT = {
  contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
  balance: "1",
  tokenId: "6",
  owner: publicKeys1.pkh,
  metadata: {
    displayUri:
      "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
    name: "Tezzardz #24",
    symbol: "FKR",
  },
  type: "nft",
};

export const ghostFA12: FA12Token = {
  type: "fa1.2",
  contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
  balance: "1",
};

export const ghostFA12WithOwner = {
  ...ghostFA12,
  owner: publicKeys1.pkh,
};

export const ghostFA2: FA2Token = {
  type: "fa2",
  contract: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
  balance: "1",
  tokenId: "1",
  metadata: {
    name: "Klondike3",
    symbol: "KL3",
    decimals: "5",
  },
};

export const ghostFA2WithOwner = {
  ...ghostFA2,
  owner: publicKeys1.pkh,
};
