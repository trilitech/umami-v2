import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import Tez from "../../components/SendFlow/Tez";

const SendButton = () => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Button ml={4} variant="primary" onClick={() => openWith(<Tez />)}>
      Send
    </Button>
  );
};

export default SendButton;
