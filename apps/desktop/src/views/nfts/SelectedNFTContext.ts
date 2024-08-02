import { type NFTWithOwner } from "@umami/core";
import { createContext } from "react";

export const SelectedNFTContext = createContext<{
  selectedNFT: NFTWithOwner | undefined;
  setSelectedNFT: (nft: NFTWithOwner) => void;
}>({
  selectedNFT: undefined,
  setSelectedNFT: _ => {},
});
