import { Box, Button, FormControl, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DoubleCheckmarkIcon } from "../../../assets/icons";
import { IS_DEV } from "../../../env";
import { selectRandomElements } from "../../../utils/tezos";
import { FormErrorMessage } from "../../FormErrorMessage";
import { MnemonicAutocomplete } from "../../MnemonicAutocomplete";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { OnboardingStep } from "../OnboardingStep";
import type { VerifySeedphraseStep } from "../OnboardingStep";

export const VerifySeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: OnboardingStep) => void;
  account: VerifySeedphraseStep["account"];
}) => {
  const seedphraseArray = account.mnemonic.split(" ");
  const form = useForm({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 5));

  const onSubmit = () => goToStep({ type: "nameAccount", account });

  return (
    <ModalContentWrapper
      icon={<DoubleCheckmarkIcon />}
      subtitle="To verify, please type in the word that corresponds to each sequence number."
      title="Verify Seed Phrase"
    >
      <Box overflowX="hidden" overflowY="auto" width="100%">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {randomElements.map((item, index) => {
              const inputName = `${item.index}`;
              const error = errors[inputName];

              return (
                <FormControl key={index} marginBottom="12px" isInvalid={!!error}>
                  <Text
                    position="absolute"
                    zIndex={1}
                    width="26px"
                    marginTop="12px"
                    marginLeft="4px"
                    textAlign="right"
                    data-testid="mnemonic-index"
                  >
                    {item.index + 1}
                  </Text>

                  <Box width="100%">
                    <MnemonicAutocomplete
                      inputName={inputName}
                      inputProps={{
                        paddingLeft: "36px",
                        size: "md",
                      }}
                      listProps={{
                        marginTop: "6px",
                      }}
                      validate={value => {
                        if (value !== item.value) {
                          return "Word doesn't match";
                        }
                      }}
                    />
                  </Box>
                  {error?.message && <FormErrorMessage>{(error as any).message}</FormErrorMessage>}
                </FormControl>
              );
            })}
            <Button width="100%" marginTop="20px" isDisabled={!isValid} size="lg" type="submit">
              Continue
            </Button>

            {IS_DEV && (
              <Button width="100%" marginTop="12px" onClick={onSubmit} size="lg">
                Bypass (Dev only)
              </Button>
            )}
          </form>
        </FormProvider>
      </Box>
    </ModalContentWrapper>
  );
};
