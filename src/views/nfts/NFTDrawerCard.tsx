import {
  Accordion,
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
} from "@chakra-ui/react";
import { NFT } from "../../types/Asset";
import { useSendFormModal } from "../home/useSendFormModal";
import { getIPFSurl } from "../../utils/token/nftUtils";
import TagsSection from "./drawer/TagsSection";
import AttributesAccordionItem from "./drawer/AttributesAccordionItem";

const NFTDrawerCard = ({ nft }: { nft: NFT }) => {
  const { modalElement, onOpen } = useSendFormModal();

  const accordionItemStyle = {
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px",
  };
  return (
    <Box>
      <Card bg="umami.gray.800">
        <CardBody>
          <AspectRatio width={"100%"} ratio={1}>
            <Image
              data-testid="nft-image"
              width="100%"
              src={getIPFSurl(nft.displayUri)}
            />
          </AspectRatio>
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      {nft.metadata.name && (
        <Heading data-testid="nft-name" mt={4} size="lg">
          {nft.metadata.name}
        </Heading>
      )}

      {nft.metadata.description && (
        <Box data-testid="nft-description">{nft.metadata.description}</Box>
      )}

      <Box>{nft.metadata.description}</Box>

      <Button
        mt={4}
        bg="umami.blue"
        onClick={(_) => {
          onOpen({
            mode: {
              type: "token",
              data: nft,
            },
          });
        }}
      >
        Send
      </Button>

      <Accordion allowMultiple={true} mt="3">
        <AttributesAccordionItem nft={nft} style={accordionItemStyle} />
      </Accordion>
      {modalElement}
    </Box>
  );
};

export default NFTDrawerCard;
