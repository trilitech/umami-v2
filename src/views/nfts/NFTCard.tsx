import { Box, Card, CardBody, Center, Heading, Image, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { fullId, thumbnailUri } from "../../types/Token";
import { NFTWithOwner, getIPFSurl } from "../../utils/token/utils";

export const NFTCard: React.FC<{
  nft: NFTWithOwner;
  onClick: () => void;
}> = ({ nft, onClick }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const name = nft.metadata.name;
  const currentLocation = useLocation();

  const isSelected = currentLocation.pathname.includes(`${nft.owner}/${fullId(nft)}`);

  const nftImageCommonProps = {
    width: "100%",
    minWidth: "242px",
    minHeight: "242px",
    objectFit: "contain" as const,
    aspectRatio: "1 / 1",
    fallbackSrc: fallbackUrl,
    src: url,
  };

  return (
    <Card
      minWidth="274px"
      borderRadius="8px"
      cursor="pointer"
      data-testid="nft-card"
      onClick={onClick}
    >
      <CardBody
        padding="16px"
        background={colors.gray[900]}
        border="1px solid"
        borderColor={isSelected ? colors.orangeL : "transparent"}
        borderRadius="8px"
        _hover={{ bg: colors.gray[700], borderColor: `${colors.gray[500]}` }}
      >
        <Center>
          <Box position="relative" width="100%">
            {/* Unfortunately, if we try to get away with two images it doesn't work
                because the blurred one always goes above the normal one.

                So, there are three images which have the same URL, but serve different purposes

                this image is invisible, but its position is default (static),
                not absolute as the other ones which makes the card grow as we resize the window */}
            <Image {...nftImageCommonProps} zIndex={2} opacity="0" />

            {/* this image adds a background blur */}
            <Image
              {...nftImageCommonProps}
              position="absolute"
              zIndex={0}
              top="0"
              filter="blur(20px)"
            />

            {/* this is the actual NFT image that you see on the card */}
            <Image
              {...nftImageCommonProps}
              position="absolute"
              zIndex={1}
              top="0"
              data-testid="nft-image"
            />
          </Box>
        </Center>
        {/* TODO: make a separate component to be shared between this and the drawer NFT card */}
        {Number(nft.balance) > 1 && (
          <Text
            position="absolute"
            display="inline"
            height="24px"
            marginTop="-36px"
            marginLeft="10px"
            paddingTop="1px"
            fontSize="14px"
            borderRadius="full"
            backgroundColor="rgba(33, 33, 33, 0.75)"
            data-testid="nft-owned-count"
            paddingX="8px"
          >
            {"x" + nft.balance}
          </Text>
        )}
        <Box overflow="hidden" data-testid="nft-card-name">
          <Heading
            overflow="hidden"
            marginTop="15px"
            marginBottom="8px"
            fontSize="sm"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {name}
          </Heading>
        </Box>

        <AddressPill address={parsePkh(nft.owner)} />
      </CardBody>
    </Card>
  );
};
