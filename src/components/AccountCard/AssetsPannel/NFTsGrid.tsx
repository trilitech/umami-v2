import { AspectRatio, Heading, Image, SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { NFT } from "../../../types/Asset";
import { truncate } from "../../../utils/format";
import { getIPFSurl } from "../../../utils/token/nftUtils";
import { NoNFTs } from "../../NoItems";

export const NFTsGrid: FC<{ nfts: NFT[]; showName?: boolean } & SimpleGridProps> = ({
  nfts,
  showName,
  ...rest
}) => {
  if (nfts.length === 0) {
    return <NoNFTs small />;
  }

  return (
    <SimpleGrid {...rest}>
      {nfts.map((nft, i) => {
        return (
          <Link to={`/nfts/${nft.id}`} key={`${nft.contract}${i}`}>
            <AspectRatio key={nft.contract + i} width="100%" ratio={1}>
              <Image width="100%" height={40} src={getIPFSurl(nft.metadata.displayUri)} />
            </AspectRatio>
            {showName && nft.metadata.name && (
              <Heading size="sm" mt={3}>
                {truncate(nft.metadata.name, 12)}
              </Heading>
            )}
          </Link>
        );
      })}
    </SimpleGrid>
  );
};
