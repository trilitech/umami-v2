import { Modal, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";

export function useModal<T>(Component: React.ComponentType<{ params: T }>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const paramsRef = useRef<T | undefined>(undefined);

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {paramsRef.current && <Component params={paramsRef.current} />}
      </Modal>
    ),
    onOpen: (options: T) => {
      // We use a ref because since setState is async we have no guarantee that
      // params will be up to date when we call onOpen
      paramsRef.current = options;
      onOpen();
    },
  };
}
