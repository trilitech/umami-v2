import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { ImplicitAddress } from "../../types/Address";
import { AddressPill } from "../AddressPill/AddressPill";

export const MultisigApprovers: React.FC<{
  signers: ImplicitAddress[];
}> = ({ signers }) => {
  return (
    <Box
      width="100%"
      marginTop="60px"
      padding="15px"
      background={colors.gray[800]}
      borderRadius="8px"
    >
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
          <h2>
            <AccordionButton as="span" flex="1" textAlign="left">
              <Heading width="100%" size="sm">
                Approvers
              </Heading>
              <AccordionIcon cursor="pointer" />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Wrap marginTop="3" data-testid="multisig-tag-section">
              {signers.map(signer => {
                return (
                  <WrapItem key={signer.pkh} padding="3px 8px" borderRadius="100px">
                    <AddressPill address={signer} />
                  </WrapItem>
                );
              })}
            </Wrap>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
