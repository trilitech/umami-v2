import { createContext } from "react";

import { NFTWithOwner } from "../../utils/token/utils";

export const SelectedNFTContext = createContext<{
  selectedNFT: NFTWithOwner | undefined;
  setSelectedNFT: (nft: NFTWithOwner) => void;
}>({
  selectedNFT: undefined,
  setSelectedNFT: (nft: NFTWithOwner) => {},
});
