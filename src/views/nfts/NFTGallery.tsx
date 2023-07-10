import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import type { NFTBalance } from "../../types/Asset";
import NFTCard from "./NFTCard";

export const NFTGallery: React.FC<{
  nfts: NFTBalance[];
  onSelect: (nft: NFTBalance) => void;
}> = ({ nfts, onSelect }) => {
  return (
    <SimpleGrid columns={4} spacing={4} overflow="scroll">
      {nfts.map((nft, i) => {
        return <NFTCard onClick={() => onSelect(nft)} key={i + nft.contract} nft={nft} />;
      })}
    </SimpleGrid>
  );
};

export default NFTGallery;
