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
            <Link to={`/home/${owner}/${fullId(nft)}`} key={`${owner}:${fullId(nft)}`}>
              <Card bg={colors.gray[800]}>
                <CardBody p="8px">
                  <AspectRatio width="100%" ratio={1}>
                    <Image width="100%" height={40} src={url} fallbackSrc={fallbackUrl} />
                  </AspectRatio>
                  {/* TODO: make a separate component to be shared between this and the drawer NFT card */}
                  {Number(nft.balance) > 1 && (
                    <Text
                      data-testid="nft-owned-count"
                      borderRadius="100px"
                      padding="0 8px"
                      height="20px"
                      size="xs"
                      backgroundColor="rgba(33, 33, 33, 0.75)"
                      display="inline"
                      position="absolute"
                      marginTop="-24px"
                      marginLeft="4px"
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
