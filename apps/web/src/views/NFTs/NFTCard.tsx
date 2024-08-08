import { Box, Card, CardBody, Center, Heading, Icon, Image } from "@chakra-ui/react";
import { type NFTBalance, thumbnailUri } from "@umami/core";
import { getIPFSurl } from "@umami/tezos";

import { NFTBalancePill } from "./NFTBalancePill";
import { SearchIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const NFTCard = ({ nft, onClick }: { nft: NFTBalance; onClick?: () => void }) => {
  const color = useColor();
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const name = nft.metadata.name;

  return (
    <Card
      flexDirection="column"
      gap="12px"
      borderRadius="6px"
      boxShadow="none"
      cursor="pointer"
      data-group
      data-testid="nft-card"
      onClick={onClick}
    >
      <CardBody padding="0" background={color("50")} borderRadius="6px">
        <Center position="relative" width="full" height="full" borderRadius="6px">
          <Center
            position="absolute"
            display="none"
            width="full"
            height="full"
            background="rgba(23, 25, 35, 0.7)"
            borderRadius="6px"
            _groupHover={{ display: "flex" }}
          >
            <Icon as={SearchIcon} width="24px" height="24px" color={color("white", "black")} />
          </Center>
          <Image
            borderRadius="6px"
            objectFit="contain"
            aspectRatio="1"
            fallbackSrc={fallbackUrl}
            src={url}
          />
          <NFTBalancePill nft={nft} />
        </Center>
      </CardBody>

      <Box overflow="hidden" data-testid="name">
        <Heading
          overflow="hidden"
          color={color("900")}
          _groupHover={{ color: color("600") }}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          size="sm"
        >
          {name}
        </Heading>
      </Box>
    </Card>
  );
};
