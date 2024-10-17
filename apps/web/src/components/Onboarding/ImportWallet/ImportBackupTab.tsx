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
import { useMultiForm } from "@umami/components";
import { useAsyncActionHandler, useRestoreBackup } from "@umami/state";
import { useRef } from "react";
import { FormProvider } from "react-hook-form";

import { CheckmarkIcon, CloseIcon, FileUploadIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { trackSuccessfulConnection } from "../../../utils/analytics";
import { persistor } from "../../../utils/persistor";
import { PasswordInput } from "../../PasswordInput";

export const ImportBackupTab = () => {
  const color = useColor();
  const restoreBackup = useRestoreBackup();
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

  const onSubmit = ({ password, file }: { file: FileList | undefined; password: string }) =>
    handleAsyncAction(async () => {
      if (!file) {
        return;
      }
      const backup = JSON.parse(await file[0].text());
      await restoreBackup(backup, password, persistor);
      trackSuccessfulConnection("onboarding", "restore_from_backup");
    });

  const { ref, ...inputRegisterProps } = register("file", {
    required: "File is required",
  });

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
                    Upload Complete
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
                Choose File
              </Button>
            )}

            <Input
              ref={element => {
                ref(element);
                inputRef.current = element;
              }}
              width="0"
              height="0"
              accept=".json,application/JSON"
              data-testid="file-input"
              type="file"
              variant="unstyled"
              {...inputRegisterProps}
            />
            {errors.file && <FormErrorMessage>{errors.file.message}</FormErrorMessage>}
          </FormControl>
          <PasswordInput inputName="password" required={false} />
          <Button width="full" isDisabled={!isValid} type="submit" variant="primary">
            Import Wallet
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
