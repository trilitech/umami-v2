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
  const sortedByLastUpdate = Object.entries(nftsByOwner)
    .flatMap(([owner, nfts]) => {
      return (nfts || []).map(nft => ({ owner, nft }));
    })
    .sort((a, b) => (b.nft.lastLevel || 0) - (a.nft.lastLevel || 0));

  return (
    <SimpleGrid
      gridTemplateColumns="repeat(auto-fit, minmax(min(100%/2, max(274px, 100%/7)), 1fr))"
      marginBottom="16px"
      minChildWidth="340px"
      spacing="16px"
    >
      {Object.entries(nftsByOwner).flatMap(([owner, nfts]) => {
        return (nfts || []).map(nft => (
          <NFTCard
            key={`${owner}:${fullId(nft)}`}
            nft={nft}
            onClick={() => onSelect(owner, nft)}
            owner={owner}
          />
        ));
      })}
    </SimpleGrid>
  );
};

export default NFTGallery;
