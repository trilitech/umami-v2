import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { ImplicitAddress } from "../../types/Address";
import AccountOrContactTile from "../AccountOrContactTile";

const MultisigApprovers: React.FC<{
  signers: ImplicitAddress[];
}> = ({ signers }) => {
  return (
    <Box w="100%" bg={colors.gray[800]} p={3} borderRadius={6} m={5}>
      <Accordion allowMultiple={true}>
        <AccordionItem bg={colors.gray[800]} border="none" borderRadius="8px">
          <h2>
            <AccordionButton as="span" flex="1" textAlign="left">
              <Heading w="100%" size="sm">
                Approvers
              </Heading>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Wrap mt="3" data-testid="multisig-tag-section">
              {signers.map(signer => {
                return (
                  <WrapItem key={signer.pkh} borderRadius="100px" padding="3px 8px">
                    <Tag color={colors.gray[400]} borderRadius="full">
                      <AccountOrContactTile pkh={signer.pkh} />
                    </Tag>
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
