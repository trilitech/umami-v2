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

import { getSmallestUnit } from "./SendFlow/utils";
import colors from "../style/colors";
import { mutezToTez, tezToMutez } from "../utils/format";
import { Estimation, TEZ_DECIMALS } from "../utils/tezos";

type AdvancedSettingsAccordionProps = {
  fee: Estimation["fee"];
  gasLimit: Estimation["gasLimit"];
  storageLimit: Estimation["storageLimit"];
  onChange: (key: keyof Estimation, value: BigNumber | number | string) => void;
};

const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  fee,
  gasLimit,
  storageLimit,
  onChange,
}) => (
  <Accordion marginTop="16px" allowToggle>
    <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
      <AccordionButton>
        <Heading flex="1" textAlign="left" marginY="10px" size="md">
          Advanced
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel gap="16px" display="flex">
        <FormControl>
          <FormLabel fontSize="14px">Fee</FormLabel>
          <InputGroup>
            <Input
              paddingRight="0"
              fontSize="14px"
              onChange={e => {
                const pattern = /^-?\d+(\.\d{0,6})?$/;

                if (!pattern.test(e.target.value) && e.target.value) {
                  return;
                }

                onChange("fee", tezToMutez(e.target.value));
              }}
              placeholder="0.000000"
              step={getSmallestUnit(TEZ_DECIMALS)}
              type="number"
              value={mutezToTez(fee)}
            />
            <InputRightElement width="44px" height="46px" children="ꜩ" />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="14px">Gas Limit</FormLabel>
          <Input
            fontSize="14px"
            onChange={e => onChange("gasLimit", new BigNumber(e.target.value))}
            placeholder="0"
            type="number"
            value={gasLimit}
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="14px">Storage Limit</FormLabel>
          <Input
            fontSize="14px"
            onChange={e => onChange("storageLimit", new BigNumber(e.target.value))}
            placeholder="0"
            type="number"
            value={storageLimit}
          />
        </FormControl>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default AdvancedSettingsAccordion;
