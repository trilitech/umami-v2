import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { type Curves } from "@taquito/signer";
import { useFormContext } from "react-hook-form";

import { useColor } from "../../../styles/useColor";
import { RadioButtons } from "../../RadioButtons";

export const CURVES = ["ed25519", "secp256k1", "p256"];

export const AdvancedAccountSettings = () => {
  const color = useColor();

  const form = useFormContext<{ derivationPath: string; curve: Curves }>();

  const {
    formState: { errors },
    register,
    resetField,
  } = form;

  return (
    <Accordion marginTop="6px" allowToggle data-testid="advanced-section">
      <AccordionItem>
        <AccordionButton justifyContent="center" color={color("900")}>
          <Heading size="md">Advanced</Heading>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <Flex flexDirection="column" gap="24px">
            <FormControl isInvalid={!!errors.curve}>
              <FormLabel>Elliptic Curve</FormLabel>
              <Flex gap="8px">
                <RadioButtons fontSize="sm" fontWeight="400" inputName="curve" options={CURVES} />
              </Flex>
            </FormControl>

            <FormControl isInvalid={!!errors.derivationPath}>
              <FormLabel>Derivation Path</FormLabel>

              <InputGroup>
                <Input
                  {...register("derivationPath", {
                    required: "Derivation path is required",
                  })}
                  placeholder="m/44'/1729'/?'/0' (default)"
                />
                <InputRightElement>
                  <Button
                    marginRight="10px"
                    borderRadius="4px"
                    onClick={() => resetField("derivationPath")}
                    size="sm"
                    variant="inputElement"
                  >
                    Reset
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.derivationPath && (
                <FormErrorMessage>{errors.derivationPath.message}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
