import { Modal, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import SendForm from "../../components/sendForm";
import { SendFormMode } from "../../components/sendForm/types";

export type Options = {
  sender: string;
  recipient?: string;
  mode: SendFormMode;
};

export const useSendFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<Options | undefined>(undefined);

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        {options && <SendForm {...options} />}
      </Modal>
    ),
    onOpen: (options: Options) => {
      setOptions(options);
      onOpen();
    },
  };
};
