import {
  VStack,
  Input,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { useForm } from "react-hook-form";
import {
  Step,
  StepType,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { selectRandomElements } from "../../../utils/tezos/helpers";

const VerifySeedphrase = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryMnemonicAccountConfig;
}) => {
  if (!config.seedphrase) throw new Error("Seedphrase not set");
  const seedphraseArray = config.seedphrase.split(" ");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onBlur",
  });
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 5));
  const onSubmit = () => {
    setStep({ type: StepType.nameAccount, config });
  };
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Verify Seed Phrase"
      subtitle="To verify, please type in the word that corresponds to each sequence number."
    >
      <Box overflow="scroll" w="100%">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack w="100%" spacing={4}>
            {randomElements.map((item, index) => {
              return (
                <FormControl
                  key={index}
                  isInvalid={!!errors[`${item.index}`] && isDirty}
                >
                  <InputGroup size="md">
                    <InputLeftElement>{item.index + 1}</InputLeftElement>
                    <Input
                      placeholder="Type here"
                      {...register(`${item.index}`, {
                        required: true,
                        validate: (value) => value === `${item.value}`,
                      })}
                    />
                  </InputGroup>
                  {errors[`${item.index}`] && (
                    <FormErrorMessage>Invalid input</FormErrorMessage>
                  )}
                </FormControl>
              );
            })}
            <Button
              type="submit"
              // bg="umami.blue"
              w="100%"
              size="lg"
              minH="48px"
              isDisabled={!isValid}
            >
              Continue
            </Button>
          </VStack>
        </form>
      </Box>
    </ModalContentWrapper>
  );
};

export default VerifySeedphrase;
