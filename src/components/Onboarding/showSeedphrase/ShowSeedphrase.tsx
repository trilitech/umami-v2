import { Box, Button, SimpleGrid, VStack } from "@chakra-ui/react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { ShowSeedphraseStep, Step, StepType } from "../useOnboardingModal";
import colors from "../../../style/colors";

export const ShowSeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: ShowSeedphraseStep["account"];
}) => {
  return (
    <ModalContentWrapper
      icon={SupportedIcons.diamont}
      title="Record Seed Phrase"
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
    >
      <VStack>
        <SimpleGrid columns={3} spacing={2}>
          {account.mnemonic.split(" ").map((item, index) => {
            return (
              <Box
                key={index}
                fontSize="sm"
                width="126px"
                border="1px dashed #D6D6D6;"
                borderRadius="4px"
                p="6px"
              >
                <Box float="left" width="30px" textAlign="right" pr="10px" color={colors.gray[450]}>
                  {index + 1}
                </Box>
                {item}
              </Box>
            );
          })}
        </SimpleGrid>
        <Button
          w="100%"
          size="lg"
          mt="20px"
          onClick={_ => {
            goToStep({ type: StepType.verifySeedphrase, account });
          }}
        >
          OK, I've recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
export default ShowSeedphrase;
