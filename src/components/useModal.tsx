import { Modal, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export function useModal<T>(Component: React.ComponentType<{ params: T }>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [params, setParams] = useState<T | undefined>(undefined);

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {params && <Component params={params} />}
      </Modal>
    ),
    onOpen: (options: T) => {
      setParams(options);
      onOpen();
    },
  };
}
