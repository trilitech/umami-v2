import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { RawPkh } from "../../types/Address";
import { fullId } from "../../types/Token";
import type { NFTBalance } from "../../types/TokenBalance";
import NFTCard from "./NFTCard";
import { orderBy } from "lodash";

export const NFTGallery: React.FC<{
  nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>;
  onSelect: (owner: RawPkh, nft: NFTBalance) => void;
}> = ({ nftsByOwner, onSelect }) => {
  const allNFTs = Object.entries(nftsByOwner).flatMap(([owner, nfts]) =>
    // In case the lastLevel is undefined, we default to 0 to ensure it is sorted last
    (nfts || []).map(nft => ({ owner, nft: { ...nft, lastLevel: nft.lastLevel || 0 } }))
  );

  const sortedByLastUpdate = orderBy(allNFTs, ["nft.lastLevel", "nft.id", "owner"], ["desc"]);

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
