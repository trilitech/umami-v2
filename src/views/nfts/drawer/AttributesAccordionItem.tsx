import {
  Wrap,
  WrapItem,
  Text,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { CSSProperties } from "react";
import { NFTBalance } from "../../../types/Asset";

const AttributesAccordionItem = ({ nft, style }: { nft: NFTBalance; style: CSSProperties }) => {
  const attributes = nft.metadata.attributes;
  if (!attributes || attributes.length === 0) {
    return null;
  }
  return (
    <AccordionItem data-testid="attributes-section" bg="umami.gray.800" style={style}>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            Attributes
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Wrap marginLeft="0" spacing="10px">
          {attributes.map(attr => {
            return (
              <WrapItem key={attr.name} flex="1" data-testid="nft-attribute">
                <Card marginBottom="2px" width="160px" height="128px" bg="umami.gray.700">
                  <CardBody padding="16px">
                    {/* TODO: make it display long attributes https://app.asana.com/0/0/1204721073861946/f */}
                    <Text color="umami.gray.400" size="sm">
                      {attr.name}
                    </Text>
                    <Heading size="md">{attr.value}</Heading>
                  </CardBody>
                </Card>
              </WrapItem>
            );
          })}
        </Wrap>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default AttributesAccordionItem;
