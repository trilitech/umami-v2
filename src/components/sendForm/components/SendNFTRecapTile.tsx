import {
  AspectRatio,
  Box,
  Flex,
  FormLabel,
  Heading,
  Image,
} from "@chakra-ui/react";
import { NFT } from "../../../types/Asset";
import { getIPFSurl } from "../../../utils/token/nftUtils";

export const SendNFTRecapTile = ({ nft }: { nft: NFT }) => {
  return (
    <Box aria-label="nft">
      <FormLabel>NFT</FormLabel>
      <Flex alignItems={"center"}>
        <AspectRatio height={14} width={14} ratio={4 / 4}>
          <Image src={getIPFSurl(nft.metadata.displayUri)} />
        </AspectRatio>
        <Heading ml={4} size={"sm"}>
          {nft.metadata.name}
        </Heading>
      </Flex>
    </Box>
  );
};
