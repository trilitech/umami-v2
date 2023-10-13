import { Button, ListItem, OrderedList, Box } from "@chakra-ui/react";
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
      <Box>
        <OrderedList spacing="12px">
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button
          w="100%"
          size="lg"
          mt="28px"
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
          mt="16px"
          variant="tertiary"
          onClick={() => goToStep({ type: StepType.restoreMnemonic })}
        >
          I already have a Seed Phrase
        </Button>
      </Box>
    </ModalContentWrapper>
  );
};

export default Notice;
