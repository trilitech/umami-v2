import { Modal, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import SendForm from "../../components/sendForm";
import { SendFormMode } from "../../components/sendForm/types";

type Options = {
  sender?: string;
  recipient?: string;
  mode: SendFormMode;
};

export const useSendFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const optionsRef = useRef<Options>();
  const options = optionsRef.current;

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <SendForm
          sender={options?.sender}
          recipient={options?.recipient}
          mode={options?.mode}
        />
      </Modal>
    ),
    onOpen: (options?: Options) => {
      optionsRef.current = options;
      onOpen();
    },
  };
};
