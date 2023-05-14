import {
  Heading,
  VStack,
  Text,
  Divider,
  Checkbox,
  Button,
  Container,
} from "@chakra-ui/react";
import React from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const Eula: React.FC<{
  setStep: (step: Step) => void;
}> = ({ setStep }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const eulaItems = [
    {
      title: "Agreement",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.",
    },
    {
      title: "Umami Description",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.",
    },
    {
      title: "Umami is not VASP",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.",
    },
    {
      title: "Hold Harmless",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.",
    },
    {
      title: "Lawful User",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut metus velit, dictum id dapibus et, pellentesque eu magna. Mauris sed tortor sapien.",
    },
  ];
  return (
    <ModalContentWrapper
      icon={SupportedIcons.document}
      title="End User License Agreement"
      subtitle="Last updated June 25, 2021"
    >
      <VStack
        spacing={"10px"}
        w="100%"
        h="100%"
        overflowX={"scroll"}
        __css={{ "-webkit-appearance": "scrollbartrack-vertical" }}
      >
        {eulaItems.map((item, index) => {
          return (
            <Container key={index}>
              <Heading size={"md"} w="100%">
                {item.title}
              </Heading>
              <Text whiteSpace="pre-wrap" pt="8px" pb="28px" size={"sm"}>
                {item.content}
              </Text>
            </Container>
          );
        })}
        <Divider />
        <Checkbox
          onChange={(e) => setIsChecked(e.target.checked)}
          pt="24px"
          pb="24px"
        >
          I confirm that I have read and agreed with the terms of the User
          Agreement
        </Checkbox>
        <Button
          w="100%"
          minH="48px"
          size="lg"
          bg="umami.blue"
          isDisabled={!isChecked}
          onClick={() => {
            setStep({ type: StepType.connectOrCreate });
          }}
        >
          Continue
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default Eula;
