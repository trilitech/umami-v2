import { Button, type ButtonProps } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";

import { FormPage as SendTezFormPage } from "../SendFlow/Tez/FormPage";

export const SendButton = (props: ButtonProps) => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;

  return (
    <Button
      padding="10px 24px"
      onClick={() => openWith(<SendTezFormPage sender={currentAccount} />)}
      size="lg"
      variant="primary"
      {...props}
    >
      Send
    </Button>
  );
};
