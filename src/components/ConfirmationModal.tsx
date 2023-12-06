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
import { useContext } from "react";

import { DynamicModalContext } from "./DynamicModal";
import { WarningIcon } from "../assets/icons";
import colors from "../style/colors";

export const ConfirmationModal: React.FC<{
  title: string;
  buttonLabel: string;
  description?: string;
  onSubmit: () => void;
}> = ({ title, description, buttonLabel, onSubmit }) => {
  const { onClose } = useContext(DynamicModalContext);
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
        <Button width="100%" onClick={onClick} variant="warning">
          {buttonLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
