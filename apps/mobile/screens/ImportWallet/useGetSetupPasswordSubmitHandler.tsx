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
} from "@umami/state";
import { decryptSecretKey } from "@umami/tezos";

export type Mode =
  | "mnemonic"
  | "secret_key"
  | "new_mnemonic"
  | "verification"
  | "add_account"
  | "save_backup";

const useGetSecretKeyHandler = () => {
  // const { allFormValues } = useDynamicModalContext();
  const restoreFromSecretKey = useRestoreFromSecretKey();

  return async (password: string, allFormValues: any) => {
    const secretKey = await decryptSecretKey(
      allFormValues.secretKey,
      allFormValues.secretKeyPassword
    );
    await restoreFromSecretKey(secretKey, password, DEFAULT_ACCOUNT_LABEL);
  };
};

const useGetMnemonicHandler = () => {
  // const { allFormValues } = useDynamicModalContext();
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const getNextAvailableAccountLabels = useGetNextAvailableAccountLabels();
  const dispatch = useAppDispatch();

  const label = getNextAvailableAccountLabels(DEFAULT_ACCOUNT_LABEL)[0];

  return async (
    { password, curve, derivationPath }: any,
    allFormValues: any,
    isNewMnemonic: boolean
  ) => {
    const mnemonic = isNewMnemonic
      ? generate24WordMnemonic()
      : allFormValues.mnemonic.map(({ val }: { val: string }) => val).join(" ");
    console.log("mnemonic", mnemonic);
    console.log("password", password);
    try {
      const accounts = await restoreFromMnemonic({
        mnemonic,
        password,
        derivationPathTemplate: derivationPath,
        label: allFormValues.accountName || label,
        curve,
        isVerified: !isNewMnemonic,
      });

      if (isNewMnemonic) {
        dispatch(accountsActions.setPassword(password));
        dispatch(accountsActions.setCurrent(accounts[0].address.pkh));
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};

const useGetVerificationHandler = () => {
  // const { openWith } = useDynamicModalContext();
  const getDecryptedMnemonic = useGetDecryptedMnemonic();
  const currentAccount = useCurrentAccount();

  return async (password: string) => {
    const mnemonic = await getDecryptedMnemonic(currentAccount as MnemonicAccount, password);
    // return openWith(<ImportantNoticeModal mnemonic={mnemonic} />, { size: "xl" });
    console.log("mnemonic", mnemonic);
  };
};

export const useGetSetupPasswordSubmitHandler = (mode: Mode) => {
  // const { onClose } = useDynamicModalContext();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  // const checkPassword = useValidateMasterPassword();

  const handleVerify = useGetVerificationHandler();
  const handleDownloadBackupFile = useDownloadBackupFile();
  const handleSecretKey = useGetSecretKeyHandler();
  const handleMnemonic = useGetMnemonicHandler();

  const isNewMnemonic = mode === "new_mnemonic" || mode === "add_account";

  return {
    onSubmit: (formValues: any, allFormValues: any) =>
      handleAsyncAction(async () => {
        const { password } = formValues;
        // await checkPassword?.(password);

        switch (mode) {
          case "secret_key": {
            await handleSecretKey(password, allFormValues);
            break;
          }
          case "mnemonic":
          case "new_mnemonic":
          case "add_account": {
            await handleMnemonic(formValues, allFormValues, isNewMnemonic);
            break;
          }
          case "verification": {
            return handleVerify(password);
          }
          case "save_backup": {
            await handleDownloadBackupFile(password);
            break;
          }
        }

        // onClose();
      }),
    isLoading,
  };
};
