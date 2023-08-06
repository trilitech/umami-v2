import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import SendTezForm from "../../components/SendFlow/Tez/Form";

const SendButton = () => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Button ml={4} variant="primary" onClick={() => openWith(<SendTezForm />)}>
      Send
    </Button>
  );
};

export default SendButton;
