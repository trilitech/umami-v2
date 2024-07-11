import { Modal, ModalOverlay } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { RemoveScroll } from "react-remove-scroll";

import { useDynamicModalFormContext } from "./FormContextProvider";

type ModalContentProps = {
  currentStep: ReactNode;
  modalProps: any;
  isOpen: boolean;
};

export const ModalContent = ({ currentStep, modalProps, isOpen }: ModalContentProps) => {
  const { reset } = useDynamicModalFormContext();
  const { onClose, ...restModalProps } = modalProps;

  return (
    <Modal
      autoFocus={false}
      blockScrollOnMount={false}
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      motionPreset="slideInBottom"
      onClose={() => {
        reset();
        onClose();
      }}
      {...restModalProps}
    >
      <ModalOverlay />
      <RemoveScroll enabled={isOpen}>{currentStep}</RemoveScroll>
    </Modal>
  );
};
