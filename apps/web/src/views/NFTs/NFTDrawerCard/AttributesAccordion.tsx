import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type AccordionProps,
  Card,
  CardBody,
  Heading,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { useColor } from "../../../styles/useColor";

export const AttributesAccordion = ({
  nft,
  ...props
}: {
  nft: NFTBalance;
} & AccordionProps) => {
  const color = useColor();
  const attributes = nft.metadata.attributes;

  if (!attributes?.length) {
    return null;
  }

  return (
    <Accordion allowToggle {...props}>
      <AccordionItem data-testid="attributes-section">
        <AccordionButton>
          <Heading flex="1" color={color("900")} textAlign="left" size="lg">
            Attributes
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Wrap spacing={{ base: "12px", md: "10px" }}>
            {attributes.map(attr => (
              <WrapItem key={attr.name} flex={{ base: "1", md: "0" }} data-testid="nft-attribute">
                <Card
                  width={{ md: "142px", base: "165px" }}
                  height={{ md: "142px", base: "165px" }}
                  marginBottom="2px"
                  background={color("100")}
                >
                  <CardBody padding="12px">
                    <Heading color={color("600")} size="sm">
                      {attr.name}
                    </Heading>
                    <Heading color={color("900")} size="md">
                      {attr.value}
                    </Heading>
                  </CardBody>
                </Card>
              </WrapItem>
            ))}
          </Wrap>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
