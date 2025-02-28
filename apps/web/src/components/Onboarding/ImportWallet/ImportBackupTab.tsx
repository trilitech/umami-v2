import {
  Button,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import { useMultiForm } from "@umami/components";
import { type ImplicitAccount } from "@umami/core";
import { useAsyncActionHandler, useRestoreBackup } from "@umami/state";
import { useEffect, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";

import { CheckmarkIcon, CloseIcon, FileUploadIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { trackOnboardingEvent, trackSuccessfulConnection } from "../../../utils/analytics";
import { persistor } from "../../../utils/persistor";
import { LoginButton } from "../../../views/SessionLogin/LoginButton";
import { PasswordInput } from "../../PasswordInput";

export const ImportBackupTab = () => {
  const color = useColor();
  const restoreBackup = useRestoreBackup();
  const [defaultAccount, setDefaultAccount] = useState<ImplicitAccount | null>(null);
  const { handleAsyncAction } = useAsyncActionHandler();
  const form = useMultiForm<{ file: FileList | undefined; password: string }>({
    mode: "onBlur",
    defaultValues: { password: "" },
  });
  const inputRef = useRef<HTMLElement | null>(null);
  const {
    formState: { isValid, errors },
    handleSubmit,
    register,
  } = form;

  const fileData = form.watch("file");

  useEffect(() => {
    const parseBackup = async () => {
      const rawBackup = await fileData?.[0].text();

      if (rawBackup) {
        const backup = JSON.parse(rawBackup);
        const defaultAccount = JSON.parse(backup["persist:accounts"]).defaultAccount;
        setDefaultAccount(defaultAccount);
      }
    };

    if (!defaultAccount && fileData?.[0]) {
      void parseBackup();
    } else if (!fileData) {
      setDefaultAccount(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData]);

  const onSubmit = ({ password, file }: { file: FileList | undefined; password: string }) =>
    handleAsyncAction(async () => {
      if (!file) {
        return;
      }
      trackOnboardingEvent("proceed_with_backup");

      const backup = JSON.parse(await file[0].text());
      if (!persistor) {
        throw new Error("Persistor is not initialized");
      }
      await restoreBackup(backup, password, persistor);
      trackSuccessfulConnection("onboarding", "restore_from_backup");
    });

  const { ref, ...inputRegisterProps } = register("file", {
    required: "File is required",
  });

  const getPasswordInput = () => {
    if (defaultAccount?.type === "social") {
      return <LoginButton idp={defaultAccount.idp} />;
    }
    return <PasswordInput inputName="password" required={false} />;
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                onClick={() => inputRef.current?.click()}
                rightIcon={<Icon as={FileUploadIcon} color={color("400")} />}
                variant="ghost"
              >
                Choose file
              </Button>
            )}

            <Input
              ref={element => {
                ref(element);
                inputRef.current = element;
              }}
              display="none"
              accept=".json,application/JSON"
              data-testid="file-input"
              type="file"
              variant="unstyled"
              {...inputRegisterProps}
            />
            {errors.file && <FormErrorMessage>{errors.file.message}</FormErrorMessage>}
          </FormControl>
          <Collapse in={!!defaultAccount}>{getPasswordInput()}</Collapse>
          <Button width="full" isDisabled={!isValid} type="submit" variant="primary">
            Import wallet
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
