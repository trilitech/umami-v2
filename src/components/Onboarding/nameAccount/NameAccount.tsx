import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { useImplicitAccounts } from "../../../utils/hooks/accountHooks";
import NameAccountDisplay from "./NameAccountDisplay";

/**
 * This component is used to add a label to ledger account or to mnemonic account group.
 *
 * NameAccount is only used when adding a mnemonic account group ar a ledger account,
 * which could be either never used or used before.
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
  const accounts = useImplicitAccounts();

  const onSubmit = (p: { accountName: string }) => {
    let label = p.accountName.trim();

    switch (account.type) {
      case "secret_key":
        return goToStep({ type: StepType.masterPassword, account: { ...account, label: label } });
      case "ledger":
        // Ledger account label should be unique among all other account labels / contact names.
        if (label.length === 0) {
          const usedLedgerLabels = accounts.map(account => account.label);
          label = firstUnusedIndexedLabel("Ledger Account", usedLedgerLabels);
        }
        return goToStep({ type: StepType.derivationPath, account: { ...account, label: label } });
      case "mnemonic":
        // This label is for the mnemonic account group, separate accounts will be named in {link}.
        label = label.length > 0 ? label : `Restored Mnemonic Account`;
        return goToStep({ type: StepType.derivationPath, account: { ...account, label: label } });
    }

    // TODO: throw an error if the account type is not supported
  };

  // TODO: Is the subtitle correct? Should we use a different one for mnemonics?
  // TODO: maybe split name account step into name ledger & name mnemonic?
  return (
    <NameAccountDisplay
      subtitle="Please choose a name for your first account. You can edit your account name later."
      onSubmit={onSubmit}
    />
  );
};

const firstUnusedIndexedLabel = (baseLabel: string, usedLabels: string[]): string => {
  let index = 1;
  while (usedLabels.includes(`${baseLabel} ${index}`)) {
    index += 1;
  }
  return `${baseLabel} ${index}`;
};

export default NameAccount;
