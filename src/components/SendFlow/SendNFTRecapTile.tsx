import { AspectRatio, Box, Flex, Heading, Image } from "@chakra-ui/react";
import { NFT } from "../../types/Token";
import { thumbnailUri } from "../../types/Token";
import { getIPFSurl } from "../../utils/token/nftUtils";
import colors from "../../style/colors";
import { truncate } from "../../utils/format";

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
