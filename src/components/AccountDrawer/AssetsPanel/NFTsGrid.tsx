import { AspectRatio, Heading, Image, SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { every } from "lodash";
import { FC } from "react";
import { Link } from "react-router-dom";
import { RawPkh } from "../../../types/Address";
import { fullId, thumbnailUri } from "../../../types/Token";
import { NFTBalance } from "../../../types/TokenBalance";
import { truncate } from "../../../utils/format";
import { getIPFSurl } from "../../../utils/token/nftUtils";
import { NoNFTs } from "../../NoItems";

export const NFTsGrid: FC<
  { nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>; showName?: boolean } & SimpleGridProps
> = ({ nftsByOwner, showName, ...rest }) => {
  const noNfts = every(nftsByOwner, nfts => !nfts || nfts.length === 0);
  if (noNfts) {
    return <NoNFTs small />;
  }

  return (
    <SimpleGrid {...rest}>
      {Object.entries(nftsByOwner).flatMap(([owner, nfts]) => {
        return (nfts || []).map(nft => {
          const url = getIPFSurl(thumbnailUri(nft));
          const fallbackUrl = getIPFSurl(nft.displayUri);
          return (
            <Link to={`/nfts/${owner}/${fullId(nft)}`} key={`${owner}:${fullId(nft)}`}>
              <AspectRatio width="100%" ratio={1}>
                <Image width="100%" height={40} src={url} fallbackSrc={fallbackUrl} />
              </AspectRatio>
              {showName && nft.metadata.name && (
                <Heading size="sm" mt={3}>
                  {truncate(nft.metadata.name, 12)}
                </Heading>
              )}
            </Link>
          );
        });
      })}
    </SimpleGrid>
  );
};
