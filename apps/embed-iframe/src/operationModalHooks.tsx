import type { PartialTezosOperation } from "@airgap/beacon-types";
import { Center, Modal, ModalCloseButton, ModalContent } from "@chakra-ui/react";

import { OperationModalContent } from "./OperationModalContent";
import { sendOperationErrorResponse, toSocialAccount, toTezosNetwork } from "./utils";
import { useOperationModalContext } from "./OperationModalContext";
import { ModalLoadingOverlay } from "./ModalLoadingOverlay";
import { estimate, getErrorContext, toAccountOperations } from "@umami/core";
import { useEmbedApp } from "./EmbedAppContext";

export const useOperationModal = () => {
  const { isOpen, onOpen, onClose, isLoading, setEstimatedOperations } = useOperationModalContext();
  const { getNetwork, getUserData } = useEmbedApp();

  const onModalCLose = () => {
    sendOperationErrorResponse("User closed the modal");
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
            <OperationModalContent />
            {isLoading && <ModalLoadingOverlay />}
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: async (operations: PartialTezosOperation[]) => {
      try {
        const accountOperations = toAccountOperations(operations, toSocialAccount(getUserData()!));
        const estimatedOperations = await estimate(
          accountOperations,
          toTezosNetwork(getNetwork()!)
        );

        setEstimatedOperations(estimatedOperations);
        onOpen();
      } catch (error) {
        sendOperationErrorResponse(getErrorContext(error).description);
        onClose();
      }
    },
  };
};
