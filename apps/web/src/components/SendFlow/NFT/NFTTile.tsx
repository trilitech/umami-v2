import { AspectRatio, Flex, Heading, Image } from "@chakra-ui/react";
import { type NFT, thumbnailUri } from "@umami/core";
import { getIPFSurl } from "@umami/tezos";

import { useColor } from "../../../styles/useColor";

export const NFTTile = ({ nft }: { nft: NFT }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const color = useColor();

  return (
    <Flex
      alignItems="center"
      width="100%"
      padding="15px 16px"
      background={color("100")}
      borderRadius="4px"
      aria-label="nft"
      data-testid="nft-name"
    >
      <AspectRatio width="42px" ratio={1}>
        <Image borderRadius="4px" fallbackSrc={fallbackUrl} src={url} />
      </AspectRatio>
      <Heading marginLeft="16px" color={color("900")} size="md">
        {nft.metadata.name}
      </Heading>
    </Flex>
  );
};
