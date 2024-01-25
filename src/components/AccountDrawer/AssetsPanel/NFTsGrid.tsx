import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Center,
  Image,
  SimpleGrid,
  SimpleGridProps,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";

import { ViewAllLink } from "./ViewAllLink";
import colors from "../../../style/colors";
import { RawPkh } from "../../../types/Address";
import { fullId, thumbnailUri } from "../../../types/Token";
import { NFTBalance } from "../../../types/TokenBalance";
import { getIPFSurl, sortedByLastUpdate } from "../../../utils/token/utils";
import { NoNFTs } from "../../NoItems";

const MAX_NFTS_SIZE = 18;

/**
 * Grid with NFTs to be displayed in the account drawer.
 *
 * Limits the number of displayed NFTs to {@link MAX_NFTS_SIZE}.
 *
 * Contains clickable NFT images. NFT drawer opens on clicking the image.
 *
 * @param owner - Address of the account for which the drawer was opened.
 * @param nfts - List of owner's NFTs.
 */
export const NFTsGrid: FC<{ owner: RawPkh; nfts: NFTBalance[] } & SimpleGridProps> = ({
  owner,
  nfts,
  ...props
}) => {
  if (nfts.length === 0) {
    return <NoNFTs small />;
  }

  const displayedNFTs = sortedByLastUpdate(nfts).slice(0, MAX_NFTS_SIZE);

  return (
    <>
      <SimpleGrid marginBottom="35px" spacing="12px" {...props}>
        {displayedNFTs.map(nft => {
          const url = getIPFSurl(thumbnailUri(nft));
          const fallbackUrl = getIPFSurl(nft.displayUri);

          const nftImageCommonProps = {
            width: "100%",
            height: 40,
            fallbackSrc: fallbackUrl,
            src: url,
          };

          return (
            <Link
              key={`${owner}:${fullId(nft)}`}
              data-testid="nft-link"
              to={`/home/${owner}/${fullId(nft)}`}
            >
              <Card
                background={colors.gray[800]}
                border="1px solid transparent"
                _hover={{ background: colors.gray[700], borderColor: colors.gray[500] }}
              >
                <CardBody overflow="hidden" padding="8px" borderRadius="6px">
                  <Center>
                    {/* Check {@link NFTCard} for details why */}
                    <Box position="relative" width="100%" height="100%">
                      <AspectRatio zIndex={2} width="100%" opacity="0" ratio={1}>
                        <Image {...nftImageCommonProps} width="100%" height={40} />
                      </AspectRatio>

                      <AspectRatio
                        position="absolute"
                        zIndex={0}
                        top="0"
                        width="100%"
                        filter="blur(20px)"
                        ratio={1}
                      >
                        <Image {...nftImageCommonProps} width="100%" height={40} />
                      </AspectRatio>

                      <AspectRatio position="absolute" zIndex={1} top="0" width="100%" ratio={1}>
                        <Image {...nftImageCommonProps} width="100%" height={40} />
                      </AspectRatio>
                    </Box>
                  </Center>
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
        })}
      </SimpleGrid>
      {nfts.length > MAX_NFTS_SIZE && <ViewAllLink to={`/nfts?accounts=${owner}`} />}
    </>
  );
};
