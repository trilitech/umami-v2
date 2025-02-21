import { useDynamicModalContext } from "@umami/components";
import { DEFAULT_ACCOUNT_LABEL, type MnemonicAccount } from "@umami/core";
import {
  accountsActions,
  generate24WordMnemonic,
  useAppDispatch,
  useAsyncActionHandler,
  useCurrentAccount,
  useDownloadBackupFile,
  useGetDecryptedMnemonic,
  useGetNextAvailableAccountLabels,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
  useValidateMasterPassword,
} from "@umami/state";
import { decryptSecretKey } from "@umami/tezos";

import { type FormFields, type Mode } from "./types";
import { trackButtonClick, trackOnboardingEvent } from "../../../utils/analytics";
import { ImportantNoticeModal } from "../VerificationFlow/ImportantNoticeModal";

const useGetSecretKeyHandler = () => {
  const { allFormValues } = useDynamicModalContext();
  const restoreFromSecretKey = useRestoreFromSecretKey();

  return async (password: string) => {
    const secretKey = await decryptSecretKey(
      allFormValues.current?.secretKey,
      allFormValues.current?.secretKeyPassword
    );
    await restoreFromSecretKey(secretKey, password, DEFAULT_ACCOUNT_LABEL);
  };
};

const useGetMnemonicHandler = () => {
  const { allFormValues } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const dispatch = useAppDispatch();

  const label = getNextAvailableAccountLabels(DEFAULT_ACCOUNT_LABEL)[0];

  return async ({ password, curve, derivationPath }: FormFields, isNewMnemonic: boolean) => {
    const mnemonic = isNewMnemonic
      ? generate24WordMnemonic()
      : allFormValues.current?.mnemonic.map(({ val }: { val: string }) => val).join(" ");

    const accounts = await restoreFromMnemonic({
      mnemonic,
      password,
      derivationPathTemplate: derivationPath,
      label: allFormValues.current?.accountName || label,
      curve,
      isVerified: !isNewMnemonic,
    });

    if (isNewMnemonic) {
      dispatch(accountsActions.setPassword(password));
      dispatch(accountsActions.setCurrent(accounts[0].address.pkh));
    }
  };
};

const useGetVerificationHandler = () => {
  const { openWith } = useDynamicModalContext();
  const getDecryptedMnemonic = useGetDecryptedMnemonic();
  const currentAccount = useCurrentAccount();

  return async (password: string) => {
    const mnemonic = await getDecryptedMnemonic(currentAccount as MnemonicAccount, password);
    return openWith(<ImportantNoticeModal mnemonic={mnemonic} />, { size: "xl" });
  };
};

export const useGetSetupPasswordSubmitHandler = (mode: Mode) => {
  const { onClose } = useDynamicModalContext();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const checkPassword = useValidateMasterPassword();

  const handleVerify = useGetVerificationHandler();
  const handleDownloadBackupFile = useDownloadBackupFile();
  const handleSecretKey = useGetSecretKeyHandler();
  const handleMnemonic = useGetMnemonicHandler();

  const isNewMnemonic = mode === "new_mnemonic" || mode === "add_account";

  return {
    onSubmit: (formValues: FormFields) =>
      handleAsyncAction(async () => {
        const { password } = formValues;
        await checkPassword?.(password);

        switch (mode) {
          case "secret_key": {
            trackOnboardingEvent("create_account_with_secret_key");
            await handleSecretKey(password);
            break;
          }
          case "mnemonic":
          case "new_mnemonic":
          case "add_account": {
            trackOnboardingEvent(`create_account_with_${mode}`);

            await handleMnemonic(formValues, isNewMnemonic);

            break;
          }
          case "verification": {
            return handleVerify(password);
          }
          case "save_backup": {
            trackButtonClick("backup", "download_backup");
            await handleDownloadBackupFile(password);
            break;
          }
        }

        onClose();
      }),
    isLoading,
  };
};
