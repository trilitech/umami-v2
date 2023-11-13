import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { useImplicitAccounts } from "../../../utils/hooks/accountHooks";
import NameAccountDisplay from "./NameAccountDisplay";

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
        if (label.length === 0) {
          const usedLedgerLabels = accounts
            .filter(account => account.type === "ledger")
            .map(account => account.label);
          label = firstUnusedIndexedLabel("Ledger Account", usedLedgerLabels);
        }
        break;
      case "mnemonic":
        if (label.length === 0) {
          label = `Account ${accounts.length + 1}`;
        }
        break;
    }

    return goToStep({ type: StepType.derivationPath, account: { ...account, label: label } });
  };

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
