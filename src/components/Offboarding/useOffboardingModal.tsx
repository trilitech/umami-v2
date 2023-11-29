import { Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";

import { OffboardingForm } from "./OffboardingForm";
import colors from "../../style/colors";

export const useOffboardingModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent background={colors.gray[900]}>
          <OffboardingForm />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
