import { Modal, useDisclosure } from "@chakra-ui/react";
import { createContext, ReactElement, useState } from "react";

export const DynamicModalContext = createContext<{
  openWith: (content: ReactElement) => void;
  onClose: () => void;
  isOpen: boolean;
}>({
  openWith: _ => {},
  onClose: () => {},
  isOpen: false,
});

// It's easier to have just one global place where you can put a modal
// and open it from anywhere in the app instead of including a modal related
// code in each place where it's used. Sometimes, it's even a problem because we
// need to have a modal next to a button that was created in a loop (e.g. lots of unused data).
//
// This hook solves this problem. It wraps the whole app in a context provider so that any
// component can open a modal from anywhere in the app using the `openWith` function.
// TODO: Add tests
export const useDynamicModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);

  const openWith = async (content: ReactElement) => {
    setModalContent(content);
    onOpen();
  };

  return {
    isOpen,
    onClose,
    openWith,
    content: (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        {modalContent}
      </Modal>
    ),
  };
};
