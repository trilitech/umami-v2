import { FA12Token, FA2Token, NFT } from "../types/Asset";
import { publicKeys1 } from "./publicKeys";

export const ghostTezzard = new NFT(
  "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
  "6",
  "1",
  publicKeys1.pkh,
  {
    displayUri:
      "https://ipfs.io/ipfs/zdj7WWXMC8RpzC6RkR2DXtD2zcfLc2QWu6tu7f6vnkeeUvSoh",
    name: "Tezzardz #24",
    symbol: "FKR",
  }
);

export const ghostFA12 = new FA12Token(
  "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
  "1"
);

export const ghostFA12WithOwner = {
  ...ghostFA12,
  owner: publicKeys1.pkh,
};

export const ghostFA2 = new FA2Token(
  "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
  "1",
  "1",
  {
    name: "Klondike3",
    symbol: "KL3",
    decimals: "5",
  }
);

export const ghostFA2WithOwner = {
  ...ghostFA2,
  owner: publicKeys1.pkh,
};
