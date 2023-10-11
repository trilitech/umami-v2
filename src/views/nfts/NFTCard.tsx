import { Image, Card, CardBody, Heading, Text, Box } from "@chakra-ui/react";
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
      cursor="pointer"
      data-testid="nft-card"
      borderRadius="8px"
      onClick={onClick}
      width="274px"
    >
      <CardBody
        borderRadius="8px"
        bg={colors.gray[900]}
        border="1px solid"
        borderColor={isSelected ? colors.orangeL : "transparent"}
        _hover={{ bg: colors.gray[700], borderColor: `${colors.gray[500]}` }}
        p="16px"
      >
        <Box>
          <Image
            data-testid="nft-image"
            objectFit="contain"
            width="242px"
            height="242px"
            src={url}
            fallbackSrc={fallbackUrl}
          />
        </Box>
        {/* TODO: make a separate component to be shared between this and the drawer NFT card */}
        {Number(nft.balance) > 1 && (
          <Text
            data-testid="nft-owned-count"
            borderRadius="full"
            height="24px"
            px="8px"
            paddingTop="1px"
            backgroundColor="rgba(33, 33, 33, 0.75)"
            display="inline"
            position="absolute"
            marginTop="-36px"
            marginLeft="10px"
            fontSize="14px"
          >
            {"x" + nft.balance}
          </Text>
        )}
        <Box overflow="hidden">
          <Heading
            mt="15px"
            mb="8px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            fontSize="sm"
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
