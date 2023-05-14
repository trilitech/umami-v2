import { VStack, Text, Input, Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { useForm } from "react-hook-form";
import { WarningIcon } from '@chakra-ui/icons'
import { Step, TemporaryAccountConfig } from "../useOnboardingModal";
import { watch } from "fs";
import { isDirty } from "zod";

function selectRandomElements(arr: any[], n: number): {
  index: number;
  value: any;
}[] {
  const shuffled = arr.map((value, index) => ({ value, index })).sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, n).sort((a, b) => a.index - b.index);
  return selected.map(({ index, value }) => ({ index, value }));
}

const VerifySeedphrase = ({
  setStep,
  config,
}: {
  setStep: (step: Step) => void;
  config: TemporaryAccountConfig
}) => {
  const seedphraseArray = config.seedphrase.split(' ')
  const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm();
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 5));
  const onSubmit = () => {
    setStep({ type: "nameAccount", config })
  };
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Verify Seed Phrase"
      subtitle="To verify, please type in the word that corresponds to each sequence number."
    >
      <Box overflow='scroll' w='100%'>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <VStack w='100%' spacing={4}>
            {randomElements.map((item, index) => {
              return (
                <FormControl isInvalid={!!errors[`${item.index}`] && isDirty}>
                  <InputGroup size='md'>
                    <InputLeftElement>
                      {item.index + 1}
                    </InputLeftElement>
                    <Input
                      placeholder='Type here'
                      {...register(`${item.index}`,
                        {
                          required: true,
                          validate: value => value === `${item.value}`,
                        })}
                    />
                  </InputGroup>
                  {errors[`${item.index}`] && (
                      <FormErrorMessage>Invalid input</FormErrorMessage>
                    )}
                </FormControl>
              )
            }
            )}
            <Button
              type="submit"
              bg='umami.blue'
              w='100%'
              size='lg'
              minH='48px'
            // disabled={!isValid}
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
