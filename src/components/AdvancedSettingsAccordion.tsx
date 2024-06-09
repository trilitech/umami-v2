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
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { getSmallestUnit, makeValidateDecimals } from "./SendFlow/utils";
import colors from "../style/colors";
import { mutezToTez, tezToMutez } from "../utils/format";
import { Estimation, TEZ_DECIMALS } from "../utils/tezos";

export const AdvancedSettingsAccordion = ({ index = 0 }) => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<{
    executeParams: Estimation[];
  }>();

  const [tezFee, setTezFee] = useState<string>(mutezToTez(getValues().executeParams[index].fee));

  const handleFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFeeValue = event.target.value;

    if (makeValidateDecimals(TEZ_DECIMALS)(newFeeValue) === true) {
      setTezFee(newFeeValue);

      if (newFeeValue) {
        setValue(`executeParams.${index}.fee`, tezToMutez(newFeeValue).toNumber());
      }
    }
  };

  return (
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
                paddingRight="28px"
                fontSize="14px"
                onBlur={() => setTezFee(mutezToTez(getValues().executeParams[index].fee))}
                onChange={handleFeeChange}
                placeholder="0.000000"
                step={getSmallestUnit(TEZ_DECIMALS)}
                type="number"
                value={tezFee}
              />
              <InputRightElement
                width="44px"
                maxWidth="fit-content"
                height="46px"
                paddingRight="12px"
                children="ꜩ"
              />
            </InputGroup>
          </FormControl>
          <FormControl isInvalid={!!errors.executeParams?.[index]?.gasLimit}>
            <FormLabel fontSize="14px">Gas Limit</FormLabel>
            <Input
              {...register(`executeParams.${index}.gasLimit`, {
                valueAsNumber: true,
                required: true,
              })}
              placeholder="0"
              type="number"
            />
          </FormControl>
          <FormControl isInvalid={!!errors.executeParams?.[index]?.storageLimit}>
            <FormLabel fontSize="14px">Storage Limit</FormLabel>
            <Input
              {...register(`executeParams.${index}.storageLimit`, {
                valueAsNumber: true,
                required: true,
              })}
              placeholder="0"
              type="number"
            />
          </FormControl>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
