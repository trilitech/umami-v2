import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { RawPkh } from "../../types/Address";
import { fullId } from "../../types/Token";
import type { NFTBalance } from "../../types/TokenBalance";
import NFTCard from "./NFTCard";

export const NFTGallery: React.FC<{
  nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>;
  onSelect: (owner: RawPkh, nft: NFTBalance) => void;
}> = ({ nftsByOwner, onSelect }) => {
  return (
    <SimpleGrid columns={4} spacing={4} overflowY="auto">
      {Object.entries(nftsByOwner).flatMap(([owner, nfts]) => {
        return (nfts || []).map(nft => (
          <NFTCard onClick={() => onSelect(owner, nft)} key={`${owner}:${fullId(nft)}`} nft={nft} />
        ));
      })}
    </SimpleGrid>
  );
};

export default NFTGallery;
