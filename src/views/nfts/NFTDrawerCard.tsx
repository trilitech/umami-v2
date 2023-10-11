import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { NFTBalance } from "../../types/TokenBalance";
import { getIPFSurl } from "../../utils/token/nftUtils";
import TagsSection from "./drawer/TagsSection";
import AttributesAccordionItem from "./drawer/AttributesAccordionItem";
import PropertiesAccordionItem from "./drawer/PropertiesAccordionItem";
import { RawPkh } from "../../types/Address";
import { DynamicModalContext } from "../../components/DynamicModal";
import { useContext } from "react";
import SendNFTForm from "../../components/SendFlow/NFT/FormPage";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { artifactUri, mimeType } from "../../types/Token";
import JsValueWrap from "../../components/AccountDrawer/JsValueWrap";
import colors from "../../style/colors";
import { tokenName } from "../../types/Token";
import ReactPlayer from "react-player";

const NFTDrawerCard = ({ nft, ownerPkh }: { nft: NFTBalance; ownerPkh: RawPkh }) => {
  const url = getIPFSurl(artifactUri(nft));
  const fallbackUrl = getIPFSurl(nft.displayUri);
  const getAccount = useGetOwnedAccount();
  const { openWith } = useContext(DynamicModalContext);
  const isVideo = mimeType(nft)?.startsWith("video/");

  const name = tokenName(nft);

  const accordionItemStyle = {
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px",
  };
  return (
    <Box>
      <Card bg={colors.gray[800]} height="534px" width="534px">
        <CardBody p="24px">
          <Box height="486px" width="486px">
            {isVideo ? (
              <ReactPlayer url={url} playing loop height="100%" width="100%" />
            ) : (
              <Image
                data-testid="nft-image"
                objectFit="contain"
                height="486px"
                width="486px"
                alt={name}
                src={url}
                fallbackSrc={fallbackUrl}
              />
            )}
          </Box>
          {Number(nft.balance) > 1 && (
            <Text
              data-testid="nft-owned-count"
              borderRadius="100px"
              height="24px"
              px="8px"
              backgroundColor="rgba(33, 33, 33, 0.75)"
              display="inline"
              position="absolute"
              marginTop="-38px"
              marginLeft="16px"
            >
              {"x" + nft.balance}
            </Text>
          )}
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      {name && (
        <Heading data-testid="nft-name" mt={4} size="lg">
          {name}
        </Heading>
      )}

      {nft.metadata.description && (
        <Box data-testid="nft-description">{nft.metadata.description}</Box>
      )}

      <Box>{nft.metadata.description}</Box>

      <Button
        mt={4}
        onClick={() => {
          openWith(<SendNFTForm sender={getAccount(ownerPkh)} nft={nft} />);
        }}
      >
        Send
      </Button>

      <Accordion allowMultiple mt="3">
        <AttributesAccordionItem nft={nft} style={accordionItemStyle} />
        <PropertiesAccordionItem nft={nft} style={accordionItemStyle} />

        <AccordionItem bg={colors.gray[800]} style={accordionItemStyle}>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                JSON
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <JsValueWrap value={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default NFTDrawerCard;
