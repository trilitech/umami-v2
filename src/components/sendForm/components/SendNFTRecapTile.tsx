import { AspectRatio, Box, Flex, Heading, Image } from "@chakra-ui/react";
import { NFT } from "../../../types/Token";
import { thumbnailUri } from "../../../types/TokenBalance";
import { getIPFSurl } from "../../../utils/token/nftUtils";
import colors from "../../../style/colors";
import { truncate } from "../../../utils/format";

export const SendNFTRecapTile = ({ nft }: { nft: NFT }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  return (
    <Box aria-label="nft" w="100%">
      <Flex alignItems="center" bg={colors.gray[800]} p={3} h="60px" data-testid="nft-name">
        <AspectRatio w="30px" h="30px" ratio={1}>
          <Image src={url} fallbackSrc={fallbackUrl} />
        </AspectRatio>
        {nft.metadata.name && (
          <Heading ml={4} size="sm">
            {truncate(nft.metadata.name, 45)}
          </Heading>
        )}
      </Flex>
    </Box>
  );
};
