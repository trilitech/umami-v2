import { useDynamicModalContext } from "@umami/components";
import { useCurrentAccount, useGetAccountBalanceDetails } from "@umami/state";

import { ArrowUpRightIcon } from "../../assets/icons";
import { IconButtonWithText } from "../IconButtonWithText/IconButtonWithText";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";
import { InsufficientFunds } from "../SendFlow/InsufficientFunds/InsufficientFunds";
import { FormPage as SendTezFormPage } from "../SendFlow/Tez/FormPage";

export const SendTezButton = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount()!;
  const isVerified = useIsAccountVerified();

  const { spendableBalance } = useGetAccountBalanceDetails(currentAccount.address.pkh);
  const hasInsufficientFunds = spendableBalance.lte(0);

  const handleClick = async () => {
    if (hasInsufficientFunds) {
      await openWith(<InsufficientFunds />);
    } else {
      await openWith(<SendTezFormPage sender={currentAccount} />);
    }
  };

  return (
    <IconButtonWithText
      icon={ArrowUpRightIcon}
      isDisabled={!isVerified}
      label="Send"
      onClick={handleClick}
      variant="primary"
    />
  );
};
