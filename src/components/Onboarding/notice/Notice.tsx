import { VStack, Button, ListItem, OrderedList } from "@chakra-ui/react";
import React from "react";
import { generate24WordMnemonic } from "../../../utils/mnemonic";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import NoticeIcon from "../../../assets/icons/Notice";

const Notice: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const noticeItems = [
    {
      content: "Write down your seed phrase and store it in a safe place.",
    },
    {
      content: "Make sure there is no one around you or looking over your shoulder.",
    },
    {
      content: "Do not copy and paste the Seed Phrase or store it on your device.",
    },
    {
      content: "Do not take a screenshot of your Seed Phrase.",
    },
  ];
  return (
    <ModalContentWrapper
      icon={<NoticeIcon />}
      title="Important Notice"
      subtitle="Please read the following before you continue to see your secret Seed Phrase."
    >
      <VStack spacing="16px" overflowX="hidden" overflowY="auto" p="4px">
        <OrderedList spacing={4}>
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button
          w="100%"
          size="lg"
          onClick={() =>
            goToStep({
              type: StepType.showSeedphrase,
              account: { type: "mnemonic", mnemonic: generate24WordMnemonic() },
            })
          }
        >
          I understand
        </Button>
        <Button
          w="100%"
          size="lg"
          variant="tertiary"
          onClick={() => goToStep({ type: StepType.restoreMnemonic })}
        >
          I already have a Seed Phrase
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default Notice;
