import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
} from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { restoreV2BackupFile, useRestoreV1BackupFile } from "./utils";
import { RotateIcon } from "../../../assets/icons";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { PasswordInput } from "../../PasswordInput";
import { ModalContentWrapper } from "../ModalContentWrapper";

type FormFields = {
  password: string;
  file: FileList;
};

export const RestoreBackupFile = () => {
  const form = useForm<FormFields>({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = form;
  const { handleAsyncAction } = useAsyncActionHandler();

  const restoreV1BackupFile = useRestoreV1BackupFile();
  const onSubmit = ({ password, file }: FormFields) =>
    handleAsyncAction(async () => {
      const fileContent = await file[0].text();
      const backup = JSON.parse(fileContent);

      const isV1 = backup["recoveryPhrases"] && backup["derivationPaths"];
      if (isV1) {
        await restoreV1BackupFile(backup, password);
      } else if (backup["persist:accounts"]) {
        await restoreV2BackupFile(backup, password);
      } else {
        throw new Error("Invalid backup file.");
      }

      window.location.reload();
    });

  return (
    <ModalContentWrapper
      icon={<RotateIcon />}
      subtitle="Select a JSON backup file and enter the password you used to encrypt it."
      title="Restore from Backup"
    >
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <ModalBody>
            <FormControl isInvalid={!!errors.file}>
              <FormLabel>Upload File</FormLabel>
              <Flex>
                <Input
                  padding="2px"
                  data-testid="file-input"
                  {...register("file", { required: "File is required" })}
                  accept=".json"
                  type="file"
                  variant="unstyled"
                />
              </Flex>
              {errors.file && (
                <FormErrorMessage data-testid="file">{errors.file.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginTop="24px">
              <PasswordInput
                data-testid="password-input"
                inputName="password"
                label="Your password (if you have one)"
                required={false}
              />
              {errors.password && (
                <FormErrorMessage data-testid="password">
                  {errors.password.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <Button width="100%" marginTop="32px" isDisabled={!isValid} size="lg" type="submit">
              Import Wallet
            </Button>
          </ModalBody>
        </form>
      </FormProvider>
    </ModalContentWrapper>
  );
};
