import { Button, Grid, GridItem, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { generate24WordMnemonic } from "../../../utils/mnemonic";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step } from "../useOnboardingModal";

export const GenerateSeed = (
  {
    setStep
  }: {
    setStep: (step: Step) => void;
  }) => {
  // seedPhrase value will be stable across rerenders
  const [seedphrase] = useState(generate24WordMnemonic());
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Record Seed Phrase"
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
    >
      <VStack overflow='scroll'>
        <Grid templateColumns='repeat(3, 1fr)' gap={3} pb='20px'>
          {seedphrase.split(' ').map((item, index) => {
            return (
              <GridItem
                fontSize='sm'
                border='1px dashed #D6D6D6;'
                borderRadius='4px'
                p='6px'>{index + 1}. {item}</GridItem>
            )
          })}
        </Grid>
        <Button
          bg='umami.blue'
          w='100%'
          size='lg'
          minH='48px'
          onClick={(_) => setStep({ type: "verifySeedphrase", config: { seedphrase } })}
        >
          OK, I’ve recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  )
};

