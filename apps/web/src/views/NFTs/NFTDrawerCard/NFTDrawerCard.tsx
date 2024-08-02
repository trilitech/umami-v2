import { Button, Card, CardBody, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useDynamicDisclosureContext } from "@umami/components";
import { type NFTBalance, artifactUri, mimeType, tokenName } from "@umami/core";
import { useCurrentAccount } from "@umami/state";
import { getIPFSurl } from "@umami/tezos";
import ReactPlayer from "react-player";

import { AttributesAccordion } from "./AttributesAccordion";
import { JSONAccordion } from "./JSONAccordion";
import { PropertiesAccordion } from "./PropertiesAccordion";
import { TagsSection } from "./TagsSection";
import { useColor } from "../../../styles/useColor";

export const NFTDrawerCard = ({ nft }: { nft: NFTBalance }) => {
  const color = useColor();
  const { openWith } = useDynamicDisclosureContext();
  const url = getIPFSurl(artifactUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const isVideo = mimeType(nft)?.startsWith("video/");
  const name = tokenName(nft);
  const account = useCurrentAccount()!;

  return (
    <Flex flexDirection="column">
      <Card boxShadow="none">
        <CardBody justifyContent="center" display="flex" padding="0">
          <Center
            width="full"
            maxWidth={{ lg: "446px", base: "366px" }}
            height="full"
            maxHeight={{ lg: "446px", base: "366px" }}
            background={color("50")}
            borderRadius="6px"
          >
            {isVideo ? (
              <ReactPlayer loop playing url={url} />
            ) : (
              <Image
                borderRadius="6px"
                objectFit="contain"
                aspectRatio="1"
                fallbackSrc={fallbackUrl}
                src={url}
              />
            )}
          </Center>
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      <Heading color={color("900")} marginY="12px" size="md">
        {name}
      </Heading>

      <Text color={color("600")} size="sm">
        {nft.metadata.description}
      </Text>

      <Button width="fit-content" marginTop="20px" padding="10px 24px" size="lg" variant="primary">
        Send
      </Button>

      <AttributesAccordion marginTop="20px" nft={nft} />

      <PropertiesAccordion marginTop={{ base: "24px", lg: "30px" }} nft={nft} />

      <JSONAccordion marginTop={{ base: "24px", lg: "30px" }} nft={nft} />
    </Flex>
  );
};
