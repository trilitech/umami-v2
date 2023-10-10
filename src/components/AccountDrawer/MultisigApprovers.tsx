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
import AddressPill from "../AddressPill/AddressPill";

const MultisigApprovers: React.FC<{
  signers: ImplicitAddress[];
}> = ({ signers }) => {
  return (
    <Box w="100%" bg={colors.gray[800]} p="15px" borderRadius="8px" mt="60px">
      <Accordion allowToggle defaultIndex={0}>
        <AccordionItem bg={colors.gray[800]} border="none" borderRadius="8px">
          <h2>
            <AccordionButton as="span" flex="1" textAlign="left">
              <Heading w="100%" size="sm">
                Approvers
              </Heading>
              <AccordionIcon cursor="pointer" />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Wrap mt="3" data-testid="multisig-tag-section">
              {signers.map(signer => {
                return (
                  <WrapItem key={signer.pkh} borderRadius="100px" padding="3px 8px">
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

export default MultisigApprovers;
