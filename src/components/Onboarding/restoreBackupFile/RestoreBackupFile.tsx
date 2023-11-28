import {
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Flex,
  ModalBody,
} from "@chakra-ui/react";
import ModalContentWrapper from "../ModalContentWrapper";
import { FormProvider, useForm } from "react-hook-form";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import RotateIcon from "../../../assets/icons/Rotate";
import PasswordInput from "../../PasswordInput";
import { restoreV2BackupFile, useRestoreV1BackupFile } from "./utils";

type FormFields = {
  password: string;
  file: FileList;
};

const RestoreBackupFile = () => {
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
      title="Restore from Backup"
      subtitle="Select a JSON backup file and enter the password you used to encrypt it."
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
            <FormControl marginTop="24px" isInvalid={!!errors.password}>
              <PasswordInput
                inputName="password"
                label="Your password"
                data-testid="password-input"
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

export default RestoreBackupFile;
