import { SimpleGrid } from "@chakra-ui/react";
import type { NFTBalance } from "@umami/core";
import { fullId } from "@umami/core";
import { type RawPkh } from "@umami/tezos";
import type React from "react";

import { NFTCard } from "./NFTCard";
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
