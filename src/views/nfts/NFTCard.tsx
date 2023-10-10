import { AspectRatio, Image, Card, CardBody, Heading, Text, Box } from "@chakra-ui/react";
import { NFTBalance } from "../../types/TokenBalance";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { thumbnailUri } from "../../types/Token";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";
import { RawPkh, parsePkh } from "../../types/Address";

const NFTCard: React.FC<{ owner: RawPkh; nft: NFTBalance; onClick: () => void }> = ({
  owner,
  nft,
  onClick,
}) => {
  const url = getIPFSurl(thumbnailUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const name = nft.metadata.name;

  return (
    <Card
      cursor="pointer"
      data-testid="nft-card"
      minWidth="275"
      maxWidth="275"
      height="340"
      borderRadius="8px"
      onClick={onClick}
    >
      <CardBody bg={colors.gray[900]} borderRadius="8px">
        <AspectRatio width="100%" ratio={1}>
          <Image data-testid="nft-image" width="100%" src={url} fallbackSrc={fallbackUrl} />
        </AspectRatio>
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
            marginTop="-40px"
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
