import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";

import { ArrowUpRightIcon } from "../../assets/icons";
import { IconButtonWithText } from "../IconButtonWithText/IconButtonWithText";
import { FormPage as SendTezFormPage } from "../SendFlow/Tez/FormPage";

export const SendTezButton = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;

  return (
    <IconButtonWithText
      icon={ArrowUpRightIcon}
      label="Send"
      onClick={() => openWith(<SendTezFormPage sender={currentAccount} />)}
      variant="primary"
    />
  );
};
