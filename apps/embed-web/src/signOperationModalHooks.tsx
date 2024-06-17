import { type PartialTezosOperation } from "@airgap/beacon-sdk";
import { Center, Modal, ModalCloseButton, ModalContent, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

import { OperationModalContent } from "./SignOperationModalContent";
import { sendOperationErrorResponse } from "./utils";

export const useSignOperationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [operations, setOperations] = useState<PartialTezosOperation[]>([]);

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
            <OperationModalContent closeModal={onClose} operations={operations} />
          </ModalContent>
        </Modal>
      </Center>
    ),
    onOpen: (operations: PartialTezosOperation[]) => {
      // TODO: if (isValid(operations)) {
      // TODO: get fee
      setOperations(operations);
      onOpen();
    },
  };
};

// TODO: updated to validate all types of operations
/*const isValid = (operations: SupportedPartialOperations[]): boolean => {
  operations.forEach(operation => {
    // TODO: check that required fields are present
  });
  return true;
}; */
