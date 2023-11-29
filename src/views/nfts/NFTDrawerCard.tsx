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
import { useGetOwnedAccount } from "../../utils/hooks/getAccountDataHooks";
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
    marginBottom: "20px",
  };
  return (
    <Box>
      <Card width="534px" height="534px" background={colors.gray[800]}>
        <CardBody padding="24px">
          <Box width="486px" height="486px">
            {isVideo ? (
              <ReactPlayer width="100%" height="100%" loop playing url={url} />
            ) : (
              <Image
                width="486px"
                height="486px"
                objectFit="contain"
                alt={name}
                data-testid="nft-image"
                fallbackSrc={fallbackUrl}
                src={url}
              />
            )}
          </Box>
          {Number(nft.balance) > 1 && (
            <Text
              position="absolute"
              display="inline"
              height="24px"
              marginTop="-38px"
              marginLeft="16px"
              borderRadius="100px"
              backgroundColor="rgba(33, 33, 33, 0.75)"
              data-testid="nft-owned-count"
              paddingX="8px"
            >
              {"x" + nft.balance}
            </Text>
          )}
        </CardBody>
      </Card>

      <TagsSection nft={nft} />

      {name && (
        <Heading marginTop="16px" marginBottom="14px" data-testid="nft-name" size="lg">
          {name}
        </Heading>
      )}

      {nft.metadata.description && (
        <Text color={colors.gray[400]} data-testid="nft-description" size="sm">
          {nft.metadata.description}
        </Text>
      )}

      <Button
        marginTop="20px"
        onClick={() => {
          openWith(<SendNFTForm nft={nft} sender={getAccount(ownerPkh)} />);
        }}
      >
        Send
      </Button>

      <Accordion marginTop="32px" allowMultiple>
        <AttributesAccordionItem nft={nft} style={accordionItemStyle} />
        <PropertiesAccordionItem nft={nft} style={accordionItemStyle} />

        <AccordionItem background={colors.gray[800]} style={accordionItemStyle}>
          <AccordionButton paddingY="16px">
            <Heading flex="1" textAlign="left" size="md">
              JSON
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <JsValueWrap value={nft} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default NFTDrawerCard;
