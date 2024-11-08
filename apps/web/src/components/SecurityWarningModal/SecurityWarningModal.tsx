import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
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
    title: "Install Extensions Only from Trusted Sources",
    content:
      "Use only official platforms like the Chrome Web Store or Firefox Add-ons, as these include security reviews. Avoid third-party websites and direct download links.",
  },
  {
    icon: ThumbsUpIcon,
    title: "Review Permissions and Ratings",
    content:
      "Before installing, check extension reviews, download counts, and requested permissions. Extensions that ask for access to sensitive data (like local storage or clipboard) should be trusted and necessary.",
  },
  {
    icon: LockIcon,
    title: "Maintain a Separate Browser for Financial Activities",
    content:
      "Use a dedicated browser with no extensions installed. This minimizes risk by isolating financial activities from other browsing.",
  },
  {
    icon: RefreshIcon,
    title: "Keep Your Browser Updated",
    content:
      "Regularly update your browser and extensions to ensure you have the latest security features and bug fixes.",
  },
  {
    icon: AlertCircleIcon,
    title: "Stay Alert to Social Engineering Risks",
    content:
      "Avoid installing extensions prompted by emails, ads, or pop-ups, as these may use deceptive methods to gain access. Reliable services generally don’t push extensions, so question any unexpected installation requests.",
  },
];

export const SecurityWarningModal = () => {
  const { onClose } = useDynamicModalContext();
  const color = useColor();
  const [openedAccordionItems, setOpenedAccordionItems] = useState<Set<number>>(new Set());

  const handleInform = () => {
    localStorage.setItem("user:isInformed", "true");
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>
        <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="16px">
          <AlertIcon width="22px" color={color("400")} />
          <Heading size="xl">Browser Extension Security Tips</Heading>
          <Text
            width="full"
            marginTop="-4px"
            color={color("700")}
            fontWeight="400"
            textAlign="center"
            size="md"
          >
            Please carefully review these guidelines to protect your wallet from potential security
            risks
          </Text>
        </Flex>
      </ModalHeader>
      <ModalBody>
        <Accordion
          as={Flex}
          flexDirection="column"
          gap="12px"
          allowToggle
          onChange={e =>
            setOpenedAccordionItems(
              prev => new Set([...prev, e as number].filter(item => item > -1))
            )
          }
        >
          {accordionItems.map(({ title, content, icon }, index) => (
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
                <Icon
                  as={icon}
                  boxSize="24px"
                  color={openedAccordionItems.has(index) ? color("greenDark") : color("400")}
                />
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
      </ModalBody>
      <ModalFooter>
        <Button
          width="full"
          isDisabled={openedAccordionItems.size !== accordionItems.length}
          onClick={handleInform}
          variant="primary"
        >
          Got it
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
