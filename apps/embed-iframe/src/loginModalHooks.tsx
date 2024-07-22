import { Center, Modal, ModalCloseButton, ModalContent } from "@chakra-ui/react";

import { LoginModalContent } from "./LoginModalContent";
import { sendLoginErrorResponse } from "./utils";

import { useLoginModalContext } from "./LoginModalContext";

export const useLoginModal = () => {
  const { isOpen, onOpen, onClose, isLoading } = useLoginModalContext();

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
          onClose={onClose}
        >
          <ModalContent>
            {!isLoading && <ModalCloseButton onClick={onModalCLose} />}
            <LoginModalContent />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen,
  };
};
