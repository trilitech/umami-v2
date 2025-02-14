import {
  Button,
  type ButtonProps,
  Center,
  Heading,
  type LinkProps,
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

type ConfirmationModalProps = {
  title: string;
  buttonLabel: string;
  description?: string;
  onSubmit: () => void;
  closeOnSubmit?: boolean;
  type?: ButtonProps["variant"];
  props?: ButtonProps & LinkProps;
};

export const ConfirmationModal = ({
  title,
  description,
  buttonLabel,
  onSubmit,
  closeOnSubmit = true,
  type = "alert",
  props,
}: ConfirmationModalProps) => {
  const { onClose } = useDynamicModalContext();
  const onClick = () => {
    onSubmit();
    if (closeOnSubmit) {
      onClose();
    }
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
        <Button width="full" onClick={onClick} variant={type} {...props}>
          {buttonLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
