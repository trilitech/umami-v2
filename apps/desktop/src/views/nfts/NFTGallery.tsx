import { SimpleGrid } from "@chakra-ui/react";
import { type NFTBalance, fullId, sortedByLastUpdate } from "@umami/core";
import { type RawPkh } from "@umami/tezos";

import { NFTCard } from "./NFTCard";

export const NFTGallery = ({
  nftsByOwner,
}: {
  nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>;
}) => {
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
