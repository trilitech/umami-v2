import { AspectRatio, Image, Card, CardBody, Heading, Text } from "@chakra-ui/react";
import type { NFT } from "../../types/Asset";
import { getIPFSurl } from "../../utils/token/nftUtils";

const NFTCard: React.FC<{ nft: NFT; onClick: () => void }> = ({ nft, onClick }) => {
  const url = getIPFSurl(nft.metadata.displayUri);
  const name = nft.metadata.name;

  return (
    <Card cursor="pointer" data-testid="nft-card" onClick={onClick}>
      <CardBody bg="umami.gray.900" borderRadius={4}>
        <AspectRatio width="100%" ratio={4 / 4}>
          <Image data-testid="nft-image" width="100%" src={url} />
        </AspectRatio>
        <Heading pt="2" fontSize="sm">
          {name}
        </Heading>

        <Text pt="2" fontSize="xs" color="umami.gray.400">
          Editions:1
        </Text>
      </CardBody>
    </Card>
  );
};

export default NFTCard;
