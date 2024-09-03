import { useDynamicModalContext } from "@umami/components";
import { type MnemonicAccount } from "@umami/core";
import {
  useAppSelector,
  useAsyncActionHandler,
  useCurrentAccount,
  useGetDecryptedMnemonic,
} from "@umami/state";

import { ImportantNoticeModal } from "./ImportantNoticeModal";
import { SetupPassword } from "../SetupPassword";

export const useHandleVerify = () => {
  const { openWith } = useDynamicModalContext();
  const currentAccount = useCurrentAccount() as MnemonicAccount;
  const getDecryptedMnemonic = useGetDecryptedMnemonic();
  const { handleAsyncAction } = useAsyncActionHandler();
  const { password: masterPassword } = useAppSelector(state => state.accounts);

  const handleProceedToVerification = async (password: string) =>
    handleAsyncAction(async () => {
      const mnemonic = await getDecryptedMnemonic(currentAccount, password);

      return openWith(<ImportantNoticeModal seedPhrase={mnemonic} />, { size: "xl" });
    });

  return () => {
    if (masterPassword) {
      return handleProceedToVerification(masterPassword);
    }

    return openWith(<SetupPassword handleProceedToVerification={handleProceedToVerification} />);
  };
};
