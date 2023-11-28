import { Modal, ModalOverlay, ModalProps, useDisclosure } from "@chakra-ui/react";
import { createContext, ReactElement, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

// this should be used in components as useContext(DynamicModalContext);
export const DynamicModalContext = createContext<{
  openWith: (content: ReactElement, size?: ModalProps["size"]) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}>({
  openWith: _ => Promise.resolve(),
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
// This hook should be used only once in the app. You place the modal wrapper and then
// use the `openWith` provided by the `DynamicModalContext` in components.
export const useDynamicModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [size, setSize] = useState<ModalProps["size"]>("md");

  const openWith = async (content: ReactElement, size: ModalProps["size"] = "md") => {
    setSize(size);
    setModalContent(content);
    onOpen();
  };

  return {
    isOpen,
    onClose,
    openWith,
    content: (
      <Modal
        autoFocus={false}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={size}
      >
        <ModalOverlay />
        <RemoveScroll enabled={isOpen}>{modalContent}</RemoveScroll>
      </Modal>
    ),
  };
};
