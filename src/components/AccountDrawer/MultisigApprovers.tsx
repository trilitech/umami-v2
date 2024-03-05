import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Wrap,
} from "@chakra-ui/react";
import React from "react";

import colors from "../../style/colors";
import { ImplicitAddress } from "../../types/Address";
import { AddressPill } from "../AddressPill/AddressPill";

export const MultisigApprovers: React.FC<{
  signers: ImplicitAddress[];
}> = ({ signers }) => (
  <Box
    width="100%"
    marginTop="40px"
    marginBottom="-20px"
    background={colors.gray[800]}
    borderRadius="8px"
  >
    <Accordion padding="15px" allowToggle>
      <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
        <AccordionButton as="span" flex="1" padding="0" textAlign="left" cursor="pointer">
          <Heading width="100%" size="md">
            Approvers
          </Heading>

          <AccordionIcon cursor="pointer" />
        </AccordionButton>
        <AccordionPanel padding="0">
          <Wrap marginTop="20px" data-testid="multisig-tag-section" spacingX="0" spacingY="12px">
            {signers.map(signer => (
              <AddressPill key={signer.pkh} marginRight="12px" address={signer} />
            ))}
          </Wrap>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>
);
