import { useImplicitAccounts } from "../../../utils/hooks/accountHooks";
import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
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
    let label;
    if (p.accountName.trim().length > 0) {
      label = p.accountName.trim();
    } else {
      label = `Account ${accounts.length + 1}`;
    }

    switch (account.type) {
      case "secret_key":
        return goToStep({ type: StepType.masterPassword, account: { ...account, label: label } });
      case "ledger":
      case "mnemonic":
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

export default NameAccount;
