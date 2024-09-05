import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount } from "@umami/state";

import { ArrowUpRightIcon } from "../../assets/icons";
import { IconButtonWithText } from "../IconButtonWithText/IconButtonWithText";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";
import { FormPage as SendTezFormPage } from "../SendFlow/Tez/FormPage";

export const SendTezButton = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;
  const isVerified = useIsAccountVerified();

  return (
    <IconButtonWithText
      icon={ArrowUpRightIcon}
      isDisabled={!isVerified}
      label="Send"
      onClick={() => openWith(<SendTezFormPage sender={currentAccount} />)}
      variant="primary"
    />
  );
};
