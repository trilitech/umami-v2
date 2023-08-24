import { Box, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { ShowMnemonicStep, Step, StepType } from "../useOnboardingModal";

export const ShowMnemonic = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: ShowMnemonicStep["account"];
}) => {
  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Record Seed Phrase"
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
    >
      <VStack overflowX="hidden">
        <SimpleGrid columns={3} spacing={2}>
          {account.mnemonic.split(" ").map((item, index) => {
            return (
              <Box
                key={index}
                fontSize="sm"
                width="140px"
                border="1px dashed #D6D6D6;"
                borderRadius="4px"
                p="6px"
              >
                <Box
                  w="18px!important"
                  float="left"
                  width="30px"
                  textAlign="right"
                  p="0"
                  pr="10px"
                  color="umami.gray.450"
                >
                  {index + 1}
                </Box>
                {item}
              </Box>
            );
          })}
        </SimpleGrid>
        <Button
          bg="umami.blue"
          w="100%"
          size="lg"
          minH="48px"
          onClick={_ => {
            goToStep({ type: StepType.verifyMnemonic, account });
          }}
        >
          OK, I've recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
export default ShowMnemonic;
