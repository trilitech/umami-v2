import {
  AspectRatio,
  Card,
  CardBody,
  Image,
  SimpleGrid,
  SimpleGridProps,
  Text,
} from "@chakra-ui/react";
import { every } from "lodash";
import { FC } from "react";
import { Link } from "react-router-dom";
import { RawPkh } from "../../../types/Address";
import { fullId, thumbnailUri } from "../../../types/Token";
import { NFTBalance } from "../../../types/TokenBalance";
import { getIPFSurl } from "../../../utils/token/nftUtils";
import { NoNFTs } from "../../NoItems";
import colors from "../../../style/colors";

export const NFTsGrid: FC<
  { nftsByOwner: Record<RawPkh, NFTBalance[] | undefined> } & SimpleGridProps
> = ({ nftsByOwner, ...rest }) => {
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
            <Link key={`${owner}:${fullId(nft)}`} to={`/home/${owner}/${fullId(nft)}`}>
              <Card background={colors.gray[800]}>
                <CardBody padding="8px">
                  <AspectRatio width="100%" ratio={1}>
                    <Image width="100%" height={40} fallbackSrc={fallbackUrl} src={url} />
                  </AspectRatio>
                  {/* TODO: make a separate component to be shared between this and the drawer NFT card */}
                  {Number(nft.balance) > 1 && (
                    <Text
                      position="absolute"
                      display="inline"
                      height="20px"
                      marginTop="-24px"
                      marginLeft="4px"
                      padding="0 8px"
                      borderRadius="100px"
                      backgroundColor="rgba(33, 33, 33, 0.75)"
                      data-testid="nft-owned-count"
                      size="xs"
                    >
                      {"x" + nft.balance}
                    </Text>
                  )}
                </CardBody>
              </Card>
            </Link>
          );
        });
      })}
    </SimpleGrid>
  );
};
