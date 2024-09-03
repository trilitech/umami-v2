import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { RecordSeedphraseModal } from "./RecordSeedphraseModal";
import {
  AlertIcon,
  EyeOffIcon,
  PencilIcon,
  ScanIcon,
  WindowCloseIcon,
} from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";

const items = [
  {
    icon: PencilIcon,
    text: "Write down your seed phrase and store it safely",
  },
  {
    icon: EyeOffIcon,
    text: "Ensure no one else can see it",
  },
  {
    icon: WindowCloseIcon,
    text: "Do not store it digitally",
  },
  {
    icon: ScanIcon,
    text: "Avoid taking screenshots",
  },
];

type ImportantNoticeModalProps = {
  seedPhrase: string;
};

export const ImportantNoticeModal = ({ seedPhrase }: ImportantNoticeModalProps) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={AlertIcon} boxSize="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">Important Notice</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            Please read the following before you continue to see your secret Seed Phrase.
          </Text>
        </Center>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VStack align="stretch" spacing="12px">
          {items.map(({ text, icon }) => (
            <Flex
              key={text}
              alignItems="center"
              gap="16px"
              padding="12px 24px"
              background={color("100")}
              borderRadius="6px"
            >
              <Icon as={icon} boxSize="24px" color={color("400")} />
              <Text color={color("900")}>{text}</Text>
            </Flex>
          ))}
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          width="full"
          onClick={() => openWith(<RecordSeedphraseModal seedPhrase={seedPhrase} />)}
          variant="primary"
        >
          Next
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
