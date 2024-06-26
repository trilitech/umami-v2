import { Modal, ModalOverlay, type ThemingProps, useDisclosure } from "@chakra-ui/react";
import { type ReactElement, createContext, useCallback, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

// this should be used in components as useContext(DynamicModalContext);
export const DynamicModalContext = createContext<{
  openWith: (
    content: ReactElement,
    props?: ThemingProps & { onClose?: () => void | Promise<void> }
  ) => Promise<void>;
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
  const { isOpen, onClose: closeModal, onOpen } = useDisclosure();
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [modalProps, setModalProps] = useState<
    ThemingProps & { onClose: () => void | Promise<void> }
  >({
    size: "md",
    onClose: closeModal,
  });

  const onClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const openWith = useCallback(
    async (
      content: ReactElement,
      props: ThemingProps & { onClose?: () => void | Promise<void> } = {}
    ) => {
      const onClose = () => {
        closeModal();
        return props.onClose?.();
      };
      setModalProps({ size: "md", ...props, onClose });
      setModalContent(content);
      onOpen();
      return Promise.resolve();
    },
    [onOpen, closeModal]
  );

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
        // this is used in e2e tests to decrease flakiness due to animations
        motionPreset={(localStorage.getItem("chakra-modal-motion-preset") as any) || undefined}
        {...modalProps}
      >
        <ModalOverlay />
        <RemoveScroll enabled={isOpen}>{modalContent}</RemoveScroll>
      </Modal>
    ),
  };
};
