import { AspectRatio, Box, Flex, Heading, Image } from "@chakra-ui/react";

import colors from "../../style/colors";
import { NFT, thumbnailUri } from "../../types/Token";
import { truncate } from "../../utils/format";
import { getIPFSurl } from "../../utils/token/utils";

export const SendNFTRecapTile = ({ nft }: { nft: NFT }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  return (
    <Box width="100%" aria-label="nft">
      <Flex
        alignItems="center"
        height="60px"
        padding={3}
        background={colors.gray[800]}
        borderRadius="4px"
        data-testid="nft-name"
      >
        <AspectRatio width="30px" height="30px" ratio={1}>
          <Image fallbackSrc={fallbackUrl} src={url} />
        </AspectRatio>
        {nft.metadata.name && (
          <Heading marginLeft={4} size="sm">
            {truncate(nft.metadata.name, 45)}
          </Heading>
        )}
      </Flex>
    </Box>
  );
};
