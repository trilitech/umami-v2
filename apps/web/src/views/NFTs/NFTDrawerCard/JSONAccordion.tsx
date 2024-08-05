import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type AccordionProps,
  Box,
  Heading,
} from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { FileCopyIcon } from "../../../assets/icons";
import { CopyButton } from "../../../components/CopyButton";
import { useColor } from "../../../styles/useColor";

export const JSONAccordion = ({ nft, ...props }: { nft: NFTBalance } & AccordionProps) => {
  const color = useColor();

  const formattedJSON = JSON.stringify(nft.metadata, null, 2);

  return (
    <Accordion allowToggle {...props}>
      <AccordionItem data-testid="json-section">
        <AccordionButton>
          <Heading flex="1" color={color("900")} textAlign="left" size="lg">
            JSON
          </Heading>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <Box position="relative">
            <CopyButton
              position="absolute"
              top="12px"
              right="0"
              width="24px"
              height="24px"
              color={color("500")}
              _hover={{ color: color("700") }}
              aria-label="Copy JSON"
              value={formattedJSON}
              variant="auxiliary"
            >
              <FileCopyIcon />
            </CopyButton>
          </Box>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              padding: "18px",
              color: color("700"),
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
              borderRadius: "8px",
              backgroundColor: color("100"),
            }}
          >
            {formattedJSON}
          </pre>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
