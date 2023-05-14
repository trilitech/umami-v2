import { VStack, Button, ListItem, OrderedList } from "@chakra-ui/react";
import React from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const Notice: React.FC<{
  setStep: (step: Step) => void;
}> = ({ setStep }) => {
  const noticeItems = [
    {
      content: "Write down your seed phrase and store it in a safe place.",
    },
    {
      content:
        "Make sure there is no one around you or looking over your shoulder.",
    },
    {
      content:
        "Do not copy and paste the Seed Phrase or store it on your device.",
    },
    {
      content: "Do not take a screenshot of your Seed Phrase.",
    },
  ];
  return (
    <ModalContentWrapper
      icon={SupportedIcons.document}
      title="Important Notice"
      subtitle="Please read the following before you continue to see your secret Seed Phrase."
    >
      <VStack spacing={"24px"} overflow={"scroll"}>
        <OrderedList spacing={4}>
          {noticeItems.map((item, index) => {
            return <ListItem key={index}>{item.content}</ListItem>;
          })}
        </OrderedList>
        <Button
          bg="umami.blue"
          w="100%"
          minH="48px"
          size="lg"
          onClick={() => {
            setStep({ type: StepType.generateSeedphrase });
          }}
        >
          I understand
        </Button>
        <Button
          w="100%"
          minH="48px"
          size="lg"
          variant={"ghost"}
          onClick={() => {
            setStep({ type: StepType.restoreSeedphrase });
          }}
        >
          I already have a Seed Phrase
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default Notice;
