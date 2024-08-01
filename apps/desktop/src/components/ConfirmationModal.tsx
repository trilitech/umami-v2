import {
  Box,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { WarningIcon } from "../assets/icons";
import colors from "../style/colors";

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

  return (
    <ModalContent>
      <ModalHeader marginBottom="10px" textAlign="center">
        <Box>
          <WarningIcon width="40px" height="40px" marginBottom="16px" />
        </Box>
        <Heading>{title}</Heading>
        <ModalCloseButton />
      </ModalHeader>
      {description && (
        <ModalBody>
          <Text align="center" color={colors.gray[400]} data-testid="description">
            {description}
          </Text>
        </ModalBody>
      )}
      <ModalFooter>
        <Button width="100%" onClick={onClick} size="lg" variant="warning">
          {buttonLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
