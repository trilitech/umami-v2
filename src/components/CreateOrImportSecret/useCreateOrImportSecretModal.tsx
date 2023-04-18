import {
  Modal,
  ModalCloseButton,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import CreateOrImportSecret from "./CreateOrImportSecret";

export const useCreateOrImportSecretModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg="umami.gray.900">
          <ModalCloseButton />
          <CreateOrImportSecret onClose={onClose} />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};
