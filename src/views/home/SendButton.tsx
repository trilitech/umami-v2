import { Button } from "@chakra-ui/react";
import { useFirstAccount } from "../../utils/hooks/accountHooks";
import { useSendFormModal } from "./useSendFormModal";

const SendButton = () => {
  const { modalElement, onOpen } = useSendFormModal();
  const account = useFirstAccount();

  return (
    <>
      <Button
        ml={4}
        bg="umami.blue"
        onClick={() =>
          onOpen({
            sender: account.address.pkh,
            mode: { type: "tez" },
          })
        }
      >
        Send
      </Button>

      {modalElement}
    </>
  );
};

export default SendButton;
