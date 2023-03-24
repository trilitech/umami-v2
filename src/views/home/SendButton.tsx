import { Button, Modal, useDisclosure } from "@chakra-ui/react";
import SendForm from "../../components/sendForm";

const SendButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button ml={4} bg="umami.blue" onClick={onOpen}>
        Send
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <SendForm />
      </Modal>
    </>
  );
};

export default SendButton;
