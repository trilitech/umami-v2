import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import colors from "../style/colors";
import { prettyTezAmount } from "../utils/format";

type AdvancedSettingsAccordionProps = {
  fee: BigNumber;
  gasLimit: BigNumber;
  storageLimit: BigNumber;
};

const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  fee,
  gasLimit,
  storageLimit,
}) => (
  <Accordion marginTop="16px" allowToggle={true}>
    <AccordionItem
      background={colors.gray[800]}
      border="none"
      borderRadius="8px"
    >
      <AccordionButton>
        <Heading flex="1" textAlign="left" marginY="10px" size="md">
          Advanced
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel gap="16px" display="flex">
        <FormControl marginBottom={4}>
          <FormLabel fontSize="14px">Fee</FormLabel>
          <InputGroup>
            <Input
              placeholder="0.00"
              type="number"
              value={prettyTezAmount(fee)}
            />
            <InputRightElement children="ꜩ" />
          </InputGroup>
        </FormControl>
        <FormControl marginBottom={4}>
          <FormLabel fontSize="14px">Gas Limit</FormLabel>
          <InputGroup>
            <Input
              placeholder="0.00"
              type="number"
              value={prettyTezAmount(gasLimit)}
            />
            <InputRightElement children="ꜩ" />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="14px">Storage Limit</FormLabel>
          <InputGroup>
            <Input
              placeholder="0.00"
              type="number"
              value={prettyTezAmount(storageLimit)}
            />
            <InputRightElement children="ꜩ" />
          </InputGroup>
        </FormControl>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default AdvancedSettingsAccordion;
