import {
  Button,
  Center,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

export const ConfirmationModal = ({
  title,
  description,
  buttonLabel,
  onSubmit,
}: {
  title: string;
  buttonLabel: string;
  description?: string;
  onSubmit: () => void;
}) => {
  const { onClose } = useDynamicModalContext();
  const onClick = () => {
    onSubmit();
    onClose();
  };

  const color = useColor();

  return (
    <ModalContent>
      <ModalHeader>
        <Heading size="xl">{title}</Heading>
        <ModalBackButton />
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Center>
          <Text
            width="full"
            maxWidth="340px"
            color={color("700")}
            fontWeight="400"
            textAlign="center"
            size="md"
          >
            {description}
          </Text>
        </Center>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={onClick} size="lg" variant="alert">
          {buttonLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
