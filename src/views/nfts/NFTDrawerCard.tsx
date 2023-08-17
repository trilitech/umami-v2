import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { artifactUri, NFTBalance } from "../../types/TokenBalance";
import { getIPFSurl } from "../../utils/token/nftUtils";
import TagsSection from "./drawer/TagsSection";
import AttributesAccordionItem from "./drawer/AttributesAccordionItem";
import PropertiesAccordionItem from "./drawer/PropertiesAccordionItem";
import { RawPkh } from "../../types/Address";
import { DynamicModalContext } from "../../components/DynamicModal";
import { useContext } from "react";
import SendNFTForm from "../../components/SendFlow/NFT/FormPage";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";

const NFTDrawerCard = ({ nft, ownerPkh }: { nft: NFTBalance; ownerPkh: RawPkh }) => {
  const url = getIPFSurl(artifactUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const getAccount = useGetOwnedAccount();
  const { openWith } = useContext(DynamicModalContext);

  const accordionItemStyle = {
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px",
  };
  return (
    <Box>
      <Card bg="umami.gray.800">
        <CardBody>
          <AspectRatio width="100%" ratio={1}>
            <Image data-testid="nft-image" width="100%" src={url} fallbackSrc={fallbackUrl} />
          </AspectRatio>
          {Number(nft.balance) > 1 && (
            <Text
              data-testid="nft-owned-count"
              borderRadius="100px"
              padding="3px 8px"
              backgroundColor="rgba(33, 33, 33, 0.75)"
              display="inline"
              position="absolute"
              marginTop="-40px"
              marginLeft="10px"
            >
              {"x" + nft.balance}
            </Text>
          )}
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
        variant="primary"
        onClick={() => {
          openWith(<SendNFTForm sender={getAccount(ownerPkh)} nft={nft} />);
        }}
      >
        Send
      </Button>

      <Accordion allowMultiple={true} mt="3">
        <AttributesAccordionItem nft={nft} style={accordionItemStyle} />
        <PropertiesAccordionItem nft={nft} style={accordionItemStyle} />

        <AccordionItem bg="umami.gray.800" style={accordionItemStyle}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                JSON
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Card bg="umami.gray.700" borderRadius="5px">
              <CardBody>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}
                >
                  {JSON.stringify(nft, null, 2)}
                </pre>
              </CardBody>
            </Card>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default NFTDrawerCard;
