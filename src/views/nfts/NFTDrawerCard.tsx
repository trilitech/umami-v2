import {
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

const NFTDrawerCard = ({ nft }: { nft: NFT }) => {
  const { modalElement, onOpen } = useSendFormModal();
  return (
    <Box>
      <Card bg="umami.gray.800">
        <CardBody>
          <AspectRatio width={"100%"} ratio={1}>
            <Image width="100%" src={getIPFSurl(nft.displayUri)} />
          </AspectRatio>
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      <Heading mt={4} size="lg">
        {nft.metadata.name}
      </Heading>

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
      {modalElement}
    </Box>
  );
};

export default NFTDrawerCard;
