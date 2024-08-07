import { type NFTBalanceWithOwner } from "@umami/core";
import { createContext } from "react";

export const SelectedNFTContext = createContext<{
  selectedNFT: NFTBalanceWithOwner | undefined;
  setSelectedNFT: (nft: NFTBalanceWithOwner) => void;
}>({
  selectedNFT: undefined,
  setSelectedNFT: _ => {},
});
