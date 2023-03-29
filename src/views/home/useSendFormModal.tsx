import { Modal, useDisclosure } from "@chakra-ui/react";
import SendForm from "../../components/sendForm";

export const useSendFormModal = (sender?: string) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <SendForm sender={sender} />
      </Modal>
    ),
    onOpen,
  };
};
