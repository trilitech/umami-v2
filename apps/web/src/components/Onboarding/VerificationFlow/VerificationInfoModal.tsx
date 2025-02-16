import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";

import { useHandleVerify } from "./useHandleVerify";
import { AlertIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";

// TODO: Replace with actual copy paste
const accordionItems = [
  {
    title: "Why verify?",
    content:
      "Verification ensures the security of your wallet and allows you to access all features.",
  },
  {
    title: "What to expect?",
    content: "Please write down your seed phrase in a safe place.",
  },
  {
    title: "What is a Seed phrase",
    content:
      "A seed phrase is a list of words that stores all the information needed to recover a wallet.",
  },
];

export const VerificationInfoModal = () => {
  const color = useColor();
  const handleVerify = useHandleVerify();

  return (
    <ModalContent>
      <ModalHeader>
        <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
          <AlertIcon width="22px" color={color("400")} />
          <Heading size="xl">How does verification work?</Heading>
        </Flex>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Accordion as={Flex} flexDirection="column" gap="12px" allowToggle>
          {accordionItems.map(({ title, content }, index) => (
            <AccordionItem key={title} border="none">
              <AccordionButton
                padding="12px 24px"
                textAlign="left"
                background={color("100")}
                borderRadius="6px"
                _hover={{
                  background: color("300"),
                }}
                _expanded={{
                  borderBottomRadius: "0",
                }}
                cursor="pointer"
              >
                <Heading width="100%" color={color("900")} size="md">
                  {index + 1}. {title}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel padding="8px 24px" background={color("100")} borderBottomRadius="6px">
                <Text>{content}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={handleVerify} variant="primary">
          Verify now
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
