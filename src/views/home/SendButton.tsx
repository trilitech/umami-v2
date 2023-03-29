import { Button } from "@chakra-ui/react";
import { useSendFormModal } from "./useSendFormModal";

const SendButton = () => {
  const { modalElement, onOpen } = useSendFormModal();

  return (
    <>
      <Button ml={4} bg="umami.blue" onClick={onOpen}>
        Send
      </Button>

      {modalElement}
    </>
  );
};

export default SendButton;
