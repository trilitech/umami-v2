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
  const { password } = useAppSelector(state => state.accounts);

  return () =>
    handleAsyncAction(async () => {
      if (password) {
        const mnemonic = await getDecryptedMnemonic(currentAccount, password);

        return openWith(<ImportantNoticeModal mnemonic={mnemonic} />, { size: "xl" });
      }

      return openWith(<SetupPassword mode="verification" />);
    });
};
