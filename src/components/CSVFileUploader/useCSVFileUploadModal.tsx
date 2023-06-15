import { Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import colors from "../../style/colors";
import CSVFileUploadForm from "./CSVFileUploadForm";

const useCSVFileUploadModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <CSVFileUploadForm onClose={onClose} />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};

export default useCSVFileUploadModal;
