import { NameAccountDisplay } from "./NameAccountDisplay";
import { useGetNextAvailableAccountLabels } from "../../../utils/hooks/labelsHooks";
import { NameAccountStep, OnboardingStep } from "../OnboardingStep";

export const DEFAULT_ACCOUNT_LABEL = "Account";

/**
 * This component is used to add a label to a newly created account.
 *
 * The step is used for creating
 *   - ledger accounts
 *   - secret key accounts
 *   - mnemonic account groups
 *
 * If the label is not provided by the user, the default name will be used.
 *
 * @param goToStep - function to go to the next step.
 * @param account - account to be named.
 * @returns NameAccount component to be rendered.
 */
export const NameAccount = ({
  goToStep,
  account,
}: {
  goToStep: (step: OnboardingStep) => void;
  account: NameAccountStep["account"];
}) => {
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const onSubmit = (p: { accountName: string }) => {
    const baseLabel = p.accountName.trim() || DEFAULT_ACCOUNT_LABEL;
    const uniqueLabel = getNextAvailableAccountLabels(baseLabel)[0];

    switch (account.type) {
      case "secret_key":
        return goToStep({
          type: "masterPassword",
          account: { ...account, label: uniqueLabel },
        });
      case "ledger":
        return goToStep({
          type: "derivationPath",
          account: { ...account, label: uniqueLabel },
        });
      case "mnemonic":
        // More than one mnemonic account can be derived during onboarding.
        // We pass base label to name individual accounts in {@link restoreRevealedMnemonicAccounts}.
        return goToStep({
          type: "derivationPath",
          account: { ...account, label: baseLabel },
        });
    }
  };

  return (
    <NameAccountDisplay
      onSubmit={onSubmit}
      subtitle="Please choose a name for your first account. You can edit your account name later."
    />
  );
};
