import { Modal, useDisclosure } from "@chakra-ui/react";
import SendForm from "../../components/sendForm";
import { NFT } from "../../types/Asset";

export const useSendFormModal = (options?: { sender?: string; nft?: NFT }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <SendForm sender={options?.sender} nft={options?.nft} />
      </Modal>
    ),
    onOpen,
  };
};
