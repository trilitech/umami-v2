import { Modal, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";

export function useModal<T>(Component: React.ComponentType<{ params: T }>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // TODO: convert to useState
  const paramsRef = useRef<T | undefined>(undefined);

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {paramsRef.current && <Component params={paramsRef.current} />}
      </Modal>
    ),
    onOpen: (options: T) => {
      paramsRef.current = options;
      onOpen();
    },
  };
}
