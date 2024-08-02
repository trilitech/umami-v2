import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type AccordionProps,
  Heading,
} from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { useColor } from "../../../styles/useColor";

export const JSONAccordion = ({ nft, ...props }: { nft: NFTBalance } & AccordionProps) => {
  const color = useColor();

  return (
    <Accordion allowToggle {...props}>
      <AccordionItem>
        <AccordionButton>
          <Heading flex="1" color={color("900")} textAlign="left" size="lg">
            JSON
          </Heading>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <pre
            style={{
              backgroundColor: color("100"),
              borderRadius: "8px",
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
              padding: "18px",
              overflow: "auto",
              color: color("700"),
            }}
          >
            {JSON.stringify(nft.metadata, null, 2)}
          </pre>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
