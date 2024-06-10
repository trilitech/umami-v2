import { ModalCloseButton, ModalContent, useToast } from "@chakra-ui/react";
import { useState } from "react";

import { EnterPassword } from "../../components/Onboarding/masterPassword/password/EnterPassword";
import { DEFAULT_ACCOUNT_LABEL } from "../../components/Onboarding/nameAccount/NameAccount";
import { NameAccountDisplay } from "../../components/Onboarding/nameAccount/NameAccountDisplay";
import { useDeriveMnemonicAccount } from "../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";

export const DeriveMnemonicAccountModal = ({
  onDone,
  fingerPrint,
}: {
  onDone: () => void;
  fingerPrint: string;
}) => {
  const [name, setName] = useState<string | undefined>();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const toast = useToast();
  const deriveMnemonicAccount = useDeriveMnemonicAccount();

  const handleSubmit = ({ name, password }: { name: string; password: string }) =>
    handleAsyncAction(
      async () => {
        await deriveMnemonicAccount({
          fingerPrint,
          password,
          label: name.trim() || DEFAULT_ACCOUNT_LABEL,
        });
        onDone();

        toast({
          description: `New account created! Successfully derived account from ${fingerPrint}`,
        });
      },
      { title: "Failed to derive new account" }
    );

  return (
    <ModalContent>
      <ModalCloseButton />
      {name ? (
        <EnterPassword
          isLoading={isLoading}
          onSubmit={password => handleSubmit({ name, password })}
        />
      ) : (
        <NameAccountDisplay
          onSubmit={p => setName(p.accountName)}
          subtitle={`Name the new account derived from ${fingerPrint}`}
        />
      )}
    </ModalContent>
  );
};
