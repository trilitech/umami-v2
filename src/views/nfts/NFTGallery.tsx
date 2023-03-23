import {
  AspectRatio,
  SimpleGrid,
  Image,
  Card,
  CardBody,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NFT } from "../../types/Asset";

const NFTCard: React.FC<{ nft: NFT }> = ({ nft }) => {
  const url = nft.metadata.displayUri.replace(
    "ipfs://",
    "https://ipfs.io/ipfs/"
  );
  const name = nft.metadata.name;

  return (
    <Card cursor={"pointer"}>
      <CardBody bg="umami.gray.900" borderRadius={4}>
        <AspectRatio width={"100%"} ratio={4 / 4}>
          <Image width="100%" src={url} />
        </AspectRatio>
        <Heading pt="2" fontSize="sm">
          {name}
        </Heading>

        <Text pt="2" fontSize="xs" color="umami.gray.400">
          {"Editions:1"}
        </Text>
      </CardBody>
    </Card>
  );
};

export const NFTGallery: React.FC<{ nfts: NFT[] }> = ({ nfts }) => {
  return (
    <SimpleGrid columns={4} spacing={4} overflow="scroll">
      {nfts.map((nft, i) => {
        return <NFTCard key={i + nft.contract} nft={nft} />;
      })}
    </SimpleGrid>
  );
};

export default NFTGallery;
