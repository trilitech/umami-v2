import { Image, Card, CardBody, Heading, Text, Box, Center } from "@chakra-ui/react";
import { NFTBalance } from "../../types/TokenBalance";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { fullId, thumbnailUri } from "../../types/Token";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import { RawPkh, parsePkh } from "../../types/Address";
import { useLocation } from "react-router-dom";

const NFTCard: React.FC<{
  owner: RawPkh;
  nft: NFTBalance;
  onClick: () => void;
}> = ({ owner, nft, onClick }) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const name = nft.metadata.name;
  const currentLocation = useLocation();

  const isSelected = currentLocation.pathname.includes(`${owner}/${fullId(nft)}`);

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
          <Image
            width="100%"
            minWidth="242px"
            minHeight="242px"
            objectFit="contain"
            aspectRatio="1 /1"
            data-testid="nft-image"
            fallbackSrc={fallbackUrl}
            src={url}
          />
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
        <Box overflow="hidden">
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

        <AddressPill address={parsePkh(owner)} />
      </CardBody>
    </Card>
  );
};

export default NFTCard;
