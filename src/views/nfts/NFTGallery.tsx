import { SimpleGrid } from "@chakra-ui/react";
import React from "react";

import { NFTCard } from "./NFTCard";
import { RawPkh } from "../../types/Address";
import { fullId } from "../../types/Token";
import type { NFTBalance } from "../../types/TokenBalance";
import { sortedByLastUpdate } from "../../utils/token/utils";

export const NFTGallery: React.FC<{
  nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>;
}> = ({ nftsByOwner }) => {
  const allNFTs = Object.entries(nftsByOwner).flatMap(([owner, nfts]) =>
    (nfts || []).map(nft => ({ owner, ...nft }))
  );

  let gridTemplateColumns = "repeat(auto-fit, minmax(min(100%/2, max(274px, 100%/7)), 1fr))";
  if (allNFTs.length < 3) {
    gridTemplateColumns = `repeat(auto-fit, min(100% / ${allNFTs.length} - 16px, 450px))`;
  }

  return (
    <SimpleGrid
      gridTemplateColumns={gridTemplateColumns}
      marginBottom="16px"
      minChildWidth="340px"
      spacing="16px"
    >
      {sortedByLastUpdate(allNFTs).map(nft => (
        <NFTCard key={`${nft.owner}:${fullId(nft)}`} nft={nft} />
      ))}
    </SimpleGrid>
  );
};
