import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { useIsUniqueLabel } from "../../../utils/hooks/setAccountDataHooks";
import NameAccountDisplay from "./NameAccountDisplay";

export const DEFAULT_ACCOUNT_LABEL = "Account";

export const indexedDefaultAccountLabel = (index: number): string =>
  `${DEFAULT_ACCOUNT_LABEL} ${index + 1}`;

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
 * @goToStep - function to go to the next step.
 * @account - account to be named.
 * @returns NameAccount component to be rendered.
 */
export const NameAccount = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: NameAccountStep["account"];
}) => {
  const isUniqueLabel = useIsUniqueLabel();
  const onSubmit = (p: { accountName: string }) => {
    let label = p.accountName.trim();

    switch (account.type) {
      case "secret_key":
        label = label.length > 0 ? label : firstUnusedDefaultLabel(isUniqueLabel);
        return goToStep({ type: StepType.masterPassword, account: { ...account, label: label } });
      case "ledger":
        label = label.length > 0 ? label : firstUnusedDefaultLabel(isUniqueLabel);
        return goToStep({ type: StepType.derivationPath, account: { ...account, label: label } });
      case "mnemonic":
        // Mnemonic account group label, individual accounts are named in {@link restoreRevealedMnemonicAccounts}.
        label = label.length > 0 ? label : DEFAULT_ACCOUNT_LABEL;
        return goToStep({ type: StepType.derivationPath, account: { ...account, label: label } });
    }
  };

  return (
    <NameAccountDisplay
      subtitle="Please choose a name for your first account. You can edit your account name later."
      onSubmit={onSubmit}
    />
  );
};

const firstUnusedDefaultLabel = (isUniqueLabel: (label: string) => boolean): string => {
  let index = 0;
  while (!isUniqueLabel(indexedDefaultAccountLabel(index))) {
    index += 1;
  }
  return indexedDefaultAccountLabel(index);
};

export default NameAccount;
