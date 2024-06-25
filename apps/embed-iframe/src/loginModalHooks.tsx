import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";
import { type TypeOfLogin } from "@trilitech-umami/umami-embed/types";

import { LoginModalContent } from "./LoginModalContent";
import { sendLoginErrorResponse } from "./utils";

export const useLoginModal = (onLoginCallback: (loginType: TypeOfLogin) => void) => {
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
            <LoginModalContent closeModal={onClose} onLoginCallback={onLoginCallback} />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen,
  };
};
