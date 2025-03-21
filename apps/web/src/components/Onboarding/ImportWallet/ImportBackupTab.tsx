import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext, useMultiForm } from "@umami/components";
import { type ImplicitAccount, type SocialAccount } from "@umami/core";
import {
  type AccountsBackup,
  type Backup,
  clearStorage,
  useAsyncActionHandler,
  useLoginToWallet,
  useRestoreBackup,
} from "@umami/state";
import { useEffect, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";

import { CheckmarkIcon, CloseIcon, FileUploadIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { trackOnboardingEvent, trackSuccessfulConnection } from "../../../utils/analytics";
import { setupPersistence } from "../../../utils/store";
import { MasterPasswordModal } from "../../MasterPasswordModal";

export const ImportBackupTab = () => {
  const color = useColor();

  const [backup, setBackup] = useState<Backup | null>(null);
  const [defaultAccount, setDefaultAccount] = useState<ImplicitAccount | null>(null);

  const restoreBackup = useRestoreBackup();
  const { openWith, onClose } = useDynamicModalContext();
  const { handleAsyncActionUnsafe } = useAsyncActionHandler();

  const form = useMultiForm<{
    file?: FileList;
  }>({
    mode: "all",
  });
  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const fileData = form.watch("file");

  const { isLoading, handleLogin } = useLoginToWallet(defaultAccount, setupPersistence);

  useEffect(() => {
    const parseBackup = async () => {
      const rawBackup = await fileData?.[0].text();

      if (rawBackup) {
        const backup = JSON.parse(rawBackup);
        const accounts = JSON.parse(backup["persist:accounts"]);
        setBackup(backup);

        if (accounts.defaultAccount) {
          const defaultAccount = JSON.parse(accounts.defaultAccount);
          setDefaultAccount(defaultAccount);
        }
      }
    };

    if (!backup && fileData?.[0]) {
      void parseBackup();
    } else if (!fileData) {
      setDefaultAccount(null);
      setBackup(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData]);

  const onSubmit = (password?: string) =>
    handleAsyncActionUnsafe(async () => {
      if (!fileData || !backup) {
        return;
      }

      trackOnboardingEvent("proceed_with_backup");

      restoreBackup(backup);

      if (password) {
        const accounts = JSON.parse(backup["persist:accounts"]) as AccountsBackup;
        await handleLogin()(accounts, { password });
      } else {
        await handleLogin<SocialAccount>()();
      }

      onClose();
      trackSuccessfulConnection("onboarding", "restore_from_backup");
    }).catch(clearStorage);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(() =>
          openWith(
            <MasterPasswordModal
              defaultAccount={defaultAccount}
              isLoading={isLoading}
              onSubmit={onSubmit}
            />
          )
        )}
      >
        <Flex flexDirection="column" gap="24px">
          <FormControl
            borderY="1px solid"
            borderTopColor={color("100")}
            borderBottomColor={color("100")}
            isInvalid={!!errors.file}
          >
            {fileData?.length ? (
              <>
                <Center gap="10px" height="72px">
                  <Text color={color("black")} fontWeight="600" size="xl">
                    Upload complete
                  </Text>
                  <Icon as={CheckmarkIcon} color={color("green")} />
                </Center>
                <Button
                  width="full"
                  fontSize="14px"
                  fontWeight="400"
                  border="none"
                  borderRadius="0"
                  onClick={() => form.setValue("file", undefined)}
                  rightIcon={<Icon as={CloseIcon} color={color("400")} />}
                >
                  {fileData[0].name}
                </Button>
              </>
            ) : (
              <Button
                width="full"
                height="72px"
                borderRadius="0"
                _hover={{
                  bg: color("100"),
                }}
                onClick={() => {
                  document.getElementById("backup-file-input")?.click();
                }}
                rightIcon={<Icon as={FileUploadIcon} color={color("400")} />}
                variant="ghost"
              >
                Choose file
              </Button>
            )}

            <Controller
              control={form.control}
              name="file"
              render={({ field: { onChange, value } }) => (
                <Input
                  key={value ? "has-file" : "no-file"}
                  display="none"
                  accept=".json,application/JSON"
                  data-testid="file-input"
                  id="backup-file-input"
                  onChange={e => onChange(e.target.files)}
                  type="file"
                  variant="unstyled"
                />
              )}
            />
            {errors.file && <FormErrorMessage>{errors.file.message}</FormErrorMessage>}
          </FormControl>
          <Button width="full" isDisabled={!fileData} type="submit" variant="primary">
            Next
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
