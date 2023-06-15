import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

export const useConfirmation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const paramsRef = useRef({ onConfirm: () => {}, body: "" });

  return {
    element: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg="umami.gray.900">
          <ModalCloseButton />
          <ModalHeader textAlign={"center"}>Confirmation</ModalHeader>
          <ModalBody>{paramsRef.current.body}</ModalBody>
          <ModalFooter>
            <Button onClick={() => paramsRef.current.onConfirm()} bg="umami.blue">
              Confirm
            </Button>
            <Button onClick={onClose} ml={2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    ),
    onClose,
    onOpen: (params: { onConfirm: () => void; body: string }) => {
      paramsRef.current = params;
      onOpen();
    },
  };
};
