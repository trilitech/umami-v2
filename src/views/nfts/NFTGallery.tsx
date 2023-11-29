import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { RawPkh } from "../../types/Address";
import { fullId } from "../../types/Token";
import type { NFTBalance } from "../../types/TokenBalance";
import NFTCard from "./NFTCard";
import { orderBy } from "lodash";

export type NFTWithOwner = NFTBalance & { owner: RawPkh };

export const NFTGallery: React.FC<{
  nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>;
  onSelect: (nft: NFTWithOwner) => void;
}> = ({ nftsByOwner, onSelect }) => {
  const allNFTs = Object.entries(nftsByOwner).flatMap(([owner, nfts]) =>
    (nfts || []).map(nft => ({ owner, ...nft }))
  );

  const sortedByLastUpdate = orderBy(allNFTs, ["lastLevel", "id", "owner"], ["desc"]);

  return (
    <SimpleGrid
      gridTemplateColumns="repeat(auto-fit, minmax(min(100%/2, max(274px, 100%/7)), 1fr))"
      marginBottom="16px"
      minChildWidth="340px"
      spacing="16px"
    >
      {sortedByLastUpdate.map(nft => (
        <NFTCard key={`${nft.owner}:${fullId(nft)}`} nft={nft} onClick={() => onSelect(nft)} />
      ))}
    </SimpleGrid>
  );
};

export default NFTGallery;
