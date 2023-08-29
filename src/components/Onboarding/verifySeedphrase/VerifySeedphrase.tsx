import {
  VStack,
  Input,
  Box,
  Button,
  FormControl,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { useForm } from "react-hook-form";
import { Step, StepType, VerifySeedphraseStep } from "../useOnboardingModal";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import { FormErrorMessage } from "../../FormErrorMessage";

const VerifySeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: VerifySeedphraseStep["account"];
}) => {
  const seedphraseArray = account.mnemonic.split(" ");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onBlur",
  });
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 5));
  const onSubmit = () => {
    goToStep({ type: StepType.nameAccount, account });
  };
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Verify Seed Phrase"
      subtitle="To verify, please type in the word that corresponds to each sequence number."
    >
      <Box overflowX="hidden" overflowY="auto" w="100%">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack w="100%" spacing={4}>
            {randomElements.map((item, index) => {
              return (
                <FormControl key={index} isInvalid={!!errors[`${item.index}`] && isDirty}>
                  <InputGroup size="md">
                    <InputLeftElement>{item.index + 1}</InputLeftElement>
                    <Input
                      placeholder="Type here"
                      {...register(`${item.index}`, {
                        required: true,
                        validate: value => value === `${item.value}`,
                      })}
                    />
                  </InputGroup>
                  {errors[`${item.index}`] && <FormErrorMessage>Invalid input</FormErrorMessage>}
                </FormControl>
              );
            })}
            <Button type="submit" w="100%" size="lg" isDisabled={!isValid}>
              Continue
            </Button>

            {
              /* devblock:start */
              <Button onClick={onSubmit} w="100%" size="lg">
                Bypass (Dev only)
              </Button>
              /* devblock:end */
            }
          </VStack>
        </form>
      </Box>
    </ModalContentWrapper>
  );
};

export default VerifySeedphrase;
