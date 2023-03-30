import { AspectRatio, Flex, FormLabel, Heading, Image } from "@chakra-ui/react";
import { NFT } from "../../../types/Asset";

export const SendNFTDisplay = ({ nft }: { nft: NFT }) => {
  return (
    <>
      <FormLabel>NFT</FormLabel>
      <Flex alignItems={"center"}>
        <AspectRatio height={14} width={14} ratio={4 / 4}>
          <Image src={nft.metadata.displayUri} />
        </AspectRatio>
        <Heading ml={4} size={"sm"}>
          {nft.metadata.name}
        </Heading>
      </Flex>
    </>
  );
};
