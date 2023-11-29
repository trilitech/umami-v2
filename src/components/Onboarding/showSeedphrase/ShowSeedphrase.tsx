import { Button, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import { KeyIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { ShowSeedphraseStep, Step, StepType } from "../useOnboardingModal";

export const ShowSeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: ShowSeedphraseStep["account"];
}) => {
  return (
    <ModalContentWrapper
      icon={<KeyIcon width="24px" height="24px" stroke={colors.gray[450]} />}
      subtitle="Please record the following 24 words in sequence in order to restore it in the future."
      title="Record Seed Phrase"
    >
      <VStack>
        <SimpleGrid columns={3} spacing={2}>
          {account.mnemonic.split(" ").map((item, index) => {
            return (
              <Flex
                key={index}
                width="126px"
                padding="6px"
                border="1px dashed"
                borderColor={colors.gray[500]}
                borderRadius="4px"
              >
                <Heading
                  width="18px"
                  marginRight="10px"
                  paddingTop="2px"
                  color={colors.gray[450]}
                  textAlign="right"
                  size="sm"
                >
                  {index + 1}
                </Heading>
                <Text data-testid={`mnemonic-word-${index}`} size="sm">
                  {item}
                </Text>
              </Flex>
            );
          })}
        </SimpleGrid>
        <Button
          width="100%"
          marginTop="20px"
          onClick={_ => {
            goToStep({ type: StepType.verifySeedphrase, account });
          }}
          size="lg"
        >
          OK, I've recorded it
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};
