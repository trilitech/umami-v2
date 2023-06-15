import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import type { NFT } from "../../types/Asset";
import NFTCard from "./NFTCard";

export const NFTGallery: React.FC<{
  nfts: NFT[];
  onSelect: (nft: NFT) => void;
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
