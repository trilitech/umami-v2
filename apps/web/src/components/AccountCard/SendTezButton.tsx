import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";

import { ArrowUpRightIcon } from "../../assets/icons";
import { IconButtonWithText } from "../IconButtonWithText/IconButtonWithText";
import { useCheckVerified } from "../Onboarding/useCheckUnverified";
import { FormPage as SendTezFormPage } from "../SendFlow/Tez/FormPage";

export const SendTezButton = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;
  const isVerified = useCheckVerified();

  return (
    <IconButtonWithText
      disabled={!isVerified}
      icon={ArrowUpRightIcon}
      label="Send"
      onClick={() => openWith(<SendTezFormPage sender={currentAccount} />)}
      variant="primary"
    />
  );
};
