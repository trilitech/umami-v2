import { Flex, Link } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type MnemonicAccount } from "@umami/core";
import { useCurrentAccount, useGetDecryptedMnemonic } from "@umami/state";

import { EmptyMessage, type EmptyMessageProps } from "./EmptyMessage";
import { useColor } from "../../styles/useColor";
import { CopySeedphraseModal } from "../Onboarding/CopySeedphraseModal";
import { SetupPassword } from "../Onboarding/SetupPassword";
import { VerificationInfoModal } from "../Onboarding/VerificationInfoModal";

export const VerifyMessage = ({ ...props }: Omit<EmptyMessageProps, "title">) => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount() as MnemonicAccount;
  const color = useColor();
  const getDecryptedMnemonic = useGetDecryptedMnemonic();

  const handleDeriveSeedphraseModal = async (password: string) => {
    const mnemonic = await getDecryptedMnemonic(currentAccount, password);

    return openWith(<CopySeedphraseModal seedPhrase={mnemonic} />);
  };

  return (
    <Flex alignItems="center" flexDirection="column" margin="auto" data-testid="verify-message">
      <EmptyMessage
        cta="Verify Now"
        onClick={() =>
          openWith(<SetupPassword handleSubmit={handleDeriveSeedphraseModal} mode="mnemonic" />)
        }
        subtitle={
          "Please verify your account, to unlock all features\n and keep your account secure."
        }
        title="Verify Your Account"
        {...props}
      />
      <Link
        marginTop="16px"
        color={color("600")}
        fontSize="12px"
        onClick={() => openWith(<VerificationInfoModal />)}
        textDecor="underline"
      >
        How does verification work?
      </Link>
    </Flex>
  );
};
