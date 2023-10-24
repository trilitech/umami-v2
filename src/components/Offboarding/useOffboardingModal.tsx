import { Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import colors from "../../style/colors";
import OffboardingForm from "./OffboardingForm";

const useOffboardingModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <OffboardingForm />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};

export default useOffboardingModal;
