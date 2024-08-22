import { Center, Modal, ModalCloseButton, ModalContent } from "@chakra-ui/react";

import { sendSignPayloadErrorResponse } from "./utils";
import { useSignPayloadModalContext } from "./SignPayloadModalContext";
import { ModalLoadingOverlay } from "./ModalLoadingOverlay";
import { SignPayloadModalContent } from "./SignPayloadModalContent";
import { SigningType } from "@airgap/beacon-types";

export const useSignPayloadModal = () => {
  const { isOpen, onOpen, onClose, isLoading, setSigningType, setPayload } =
    useSignPayloadModalContext();

  const onModalCLose = () => {
    sendSignPayloadErrorResponse("User closed the modal");
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
            <SignPayloadModalContent />
            {isLoading && <ModalLoadingOverlay />}
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: (signingType: SigningType, payload: string) => {
      setSigningType(signingType);
      setPayload(payload);
      onOpen();
    },
  };
};
