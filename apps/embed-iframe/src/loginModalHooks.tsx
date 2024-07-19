import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";

import { LoginModalContent } from "./LoginModalContent";
import { sendLoginErrorResponse } from "./utils";

export const useLoginModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onModalCLose = () => {
    sendLoginErrorResponse("User closed the modal");
    onClose();
  };

  return {
    modalElement: (
      <Center>
        <Modal
          autoFocus={false}
          closeOnOverlayClick={false}
          isCentered
          isOpen={isOpen}
          // which one to use here?
          onClose={onClose}
        >
          <ModalContent>
            <ModalCloseButton onClick={onModalCLose} />
            <LoginModalContent closeModal={onClose} />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen,
  };
};
