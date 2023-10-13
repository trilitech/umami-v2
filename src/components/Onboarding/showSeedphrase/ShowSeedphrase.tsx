import { Button, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import ModalContentWrapper from "../ModalContentWrapper";
import { ShowSeedphraseStep, Step, StepType } from "../useOnboardingModal";
import colors from "../../../style/colors";
import KeyIcon from "../../../assets/icons/Key";

export const ShowSeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: ShowSeedphraseStep["account"];
}) => {
  return (
    <ModalContentWrapper
      icon={<KeyIcon stroke={colors.gray[450]} width="24px" height="24px" />}
      title="Record Seed Phrase"
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
    >
      <VStack>
        <SimpleGrid columns={3} spacing={2}>
          {account.mnemonic.split(" ").map((item, index) => {
            return (
              <Flex
                key={index}
                width="126px"
                border="1px dashed"
                borderColor={colors.gray[500]}
                borderRadius="4px"
                p="6px"
              >
                <Heading
                  width="18px"
                  textAlign="right"
                  mr="10px"
                  pt="2px"
                  size="sm"
                  color={colors.gray[450]}
                >
                  {index + 1}
                </Heading>
                <Text size="sm">{item}</Text>
              </Flex>
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
