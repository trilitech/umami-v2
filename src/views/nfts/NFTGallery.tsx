import { Wrap } from "@chakra-ui/react";
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
    <Wrap marginBottom="16px" spacing="16px">
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
    </Wrap>
  );
};

export default NFTGallery;
