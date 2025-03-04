import { Button, Card, CardBody, Flex, Heading, Image, Square, Text } from "@chakra-ui/react";
import Hotjar from "@hotjar/browser";
import { useDynamicModalContext } from "@umami/components";
import { type NFTBalance, artifactUri, mimeType, tokenName } from "@umami/core";
import { getIPFSurl } from "@umami/tezos";
import ReactPlayer from "react-player";

import { AttributesAccordion } from "./AttributesAccordion";
import { JSONAccordion } from "./JSONAccordion";
import { PropertiesAccordion } from "./PropertiesAccordion";
import { TagsSection } from "./TagsSection";
import { FormPage as SendNFTForm } from "../../../components/SendFlow/NFT/FormPage";
import { useColor } from "../../../styles/useColor";
import { NFTBalancePill } from "../NFTBalancePill";

export const NFTDrawerCard = ({ nft }: { nft: NFTBalance }) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const url = getIPFSurl(artifactUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const isVideo = mimeType(nft)?.startsWith("video/");
  const name = tokenName(nft);

  Hotjar.stateChange("nft/drawer_card");

  return (
    <Flex flexDirection="column">
      <Card boxShadow="none">
        <CardBody
          justifyContent="center"
          display="flex"
          maxHeight={{ base: "366px", md: "446px" }}
          padding="0"
          aspectRatio={1}
        >
          <Square
            maxHeight={{ base: "366px", md: "446px" }}
            background={color("50")}
            borderRadius="6px"
            size="full"
          >
            {isVideo ? (
              <ReactPlayer data-testid="nft-video" loop playing url={url} />
            ) : (
              <Image
                maxHeight={{ base: "366px", md: "446px" }}
                borderRadius="6px"
                objectFit="contain"
                data-testid="nft-image"
                fallbackSrc={fallbackUrl}
                src={url}
              />
            )}

            <NFTBalancePill nft={nft} />
          </Square>
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      <Heading color={color("900")} marginY="12px" size="xl">
        {name}
      </Heading>

      <Text color={color("600")} size="sm">
        {nft.metadata.description}
      </Text>

      <Button
        width="fit-content"
        marginTop="20px"
        padding="10px 24px"
        onClick={() => openWith(<SendNFTForm nft={nft} />)}
        size="lg"
        variant="primary"
      >
        Send
      </Button>

      <AttributesAccordion marginTop="20px" nft={nft} />

      <PropertiesAccordion marginTop={{ base: "24px", md: "30px" }} nft={nft} />

      <JSONAccordion marginTop={{ base: "24px", md: "30px" }} nft={nft} />
    </Flex>
  );
};
