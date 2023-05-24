import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import colors from "../../style/colors";
import BuyTezForm from "./BuyTezForm";

const useBuyTezModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    modalElement: (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={colors.gray[900]}>
          <BuyTezForm />
        </ModalContent>
      </Modal>
    ),
    onOpen,
  };
};

export default useBuyTezModal;
