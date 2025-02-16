import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useState } from "react";

import {
  AlertCircleIcon,
  AlertIcon,
  CheckmarkIcon,
  LockIcon,
  RefreshIcon,
  ThumbsUpIcon,
} from "../../assets/icons";
import { useColor } from "../../styles/useColor";

const accordionItems = [
  {
    icon: CheckmarkIcon,
    title: "Install extensions only from trusted sources",
    content:
      "Download extensions exclusively from official platforms like the Chrome Web Store or Firefox Add-ons, which conduct security reviews. Avoid third-party websites or direct download links to minimize risk.",
  },
  {
    icon: ThumbsUpIcon,
    title: "Review permissions and ratings carefully",
    content:
      "Before installing an extension, examine its reviews, download count, and requested permissions. Be cautious with extensions that request access to sensitive data, such as local storage or the clipboard. Only install those that are both trustworthy and essential.",
  },
  {
    icon: LockIcon,
    title: "Use a separate browser for financial activities",
    content:
      "Maintain a dedicated browser for financial transactions, free of additional extensions. This isolates financial activities and reduces potential security risks from other browsing habits.",
  },
  {
    icon: RefreshIcon,
    title: "Keep your browser and extensions updated",
    content:
      "Ensure your browser and extensions are always up to date. Regular updates provide the latest security features and fix known vulnerabilities.",
  },
  {
    icon: AlertCircleIcon,
    title: "Stay alert to social engineering risks",
    content:
      "Avoid installing extensions prompted by unsolicited emails, advertisements, or pop-ups. These can often use deceptive tactics to compromise your security. Reputable services rarely push extensions through unexpected prompts—always verify before proceeding.",
  },
];

export const SecurityWarningModal = () => {
  const { onClose } = useDynamicModalContext();
  const color = useColor();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleInform = () => {
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>
        <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
          <AlertIcon width="22px" color={color("400")} />
          <Heading size="xl">Browser extension security tips</Heading>
          <Text
            width="full"
            marginTop="-4px"
            color={color("700")}
            fontWeight="400"
            textAlign="center"
            size="md"
          >
            Follow these essential guidelines to safeguard your wallet from security risks
          </Text>
        </Flex>
      </ModalHeader>
      <ModalBody>
        <Accordion as={Flex} flexDirection="column" gap="12px" allowToggle>
          {accordionItems.map(({ title, content, icon }) => (
            <AccordionItem key={title} border="none">
              <AccordionButton
                gap="16px"
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
                data-testid="accordion-button"
              >
                <Icon as={icon} boxSize="24px" color={color("400")} />
                <Heading width="100%" color={color("900")} size="md">
                  {title}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel padding="8px 24px" background={color("100")} borderBottomRadius="6px">
                <Text>{content}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        <Checkbox
          marginTop="16px"
          color={color("700")}
          isChecked={isAgreed}
          marginX="auto"
          onChange={e => setIsAgreed(e.target.checked)}
        >
          <Text fontWeight="bold" whiteSpace="break-spaces">
            I understand and accept the risks.
          </Text>
        </Checkbox>
      </ModalBody>
      <ModalFooter>
        <Button width="full" isDisabled={!isAgreed} onClick={handleInform} variant="primary">
          Continue
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
