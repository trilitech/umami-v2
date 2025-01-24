import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
} from "@chakra-ui/react";
import { Hints, type SignPage } from "@umami/core";

import { useColor } from "../../styles/useColor";

type HintsProps = {
  signPage: SignPage;
};

export const HintsAccordion = ({ signPage }: HintsProps) => {
  const color = useColor();

  if (!(signPage in Hints) || !Hints[signPage].header || !Hints[signPage].description) {
    return null;
  }

  return (
    <Accordion
      width="full"
      marginTop="16px"
      marginBottom="16px"
      allowToggle
      data-testid="hints-accordion"
    >
      <AccordionItem border="none" borderRadius="8px" backgroundColor={color("100")}>
        <Heading>
          <AccordionButton padding="12px" borderRadius="8px">
            <Heading flex="1" textAlign="left" size="md">
              {Hints[signPage].header}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel padding="16px">{Hints[signPage].description}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
