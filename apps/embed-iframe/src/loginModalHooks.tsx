import { Center, Modal, ModalCloseButton, ModalContent } from "@chakra-ui/react";

import { track } from "@vercel/analytics";

import { LoginModalContent } from "./LoginModalContent";
import { sendLoginErrorResponse } from "./utils";

import { useLoginModalContext } from "./LoginModalContext";
import { useEmbedApp } from "./EmbedAppContext";
import { ModalLoadingOverlay } from "./ModalLoadingOverlay";

export const useLoginModal = () => {
  const { isOpen, onOpen, onClose, isLoading } = useLoginModalContext();
  const { getNetwork, getDAppOrigin } = useEmbedApp();

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
            <ModalCloseButton onClick={onModalCLose} />
            <LoginModalContent />
            {isLoading && <ModalLoadingOverlay />}
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: () => {
      track("login_modal_opened", { network: getNetwork(), dAppOrigin: getDAppOrigin() });
      onOpen();
    },
  };
};
