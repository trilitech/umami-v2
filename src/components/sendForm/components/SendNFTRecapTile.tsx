import { AspectRatio, Box, Flex, FormLabel, Heading, Image } from "@chakra-ui/react";
import { thumbnailUri, NFTBalance } from "../../../types/TokenBalance";
import { getIPFSurl } from "../../../utils/token/nftUtils";

export const SendNFTRecapTile = ({ nft }: { nft: NFTBalance }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  return (
    <Box aria-label="nft">
      <FormLabel>NFT</FormLabel>
      <Flex alignItems="center">
        <AspectRatio height={14} width={14} ratio={1}>
          <Image src={url} fallbackSrc={fallbackUrl} />
        </AspectRatio>
        <Heading ml={4} size="sm">
          {nft.metadata.name}
        </Heading>
      </Flex>
    </Box>
  );
};
