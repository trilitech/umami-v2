import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
} from "@chakra-ui/react";
import { useAsyncActionHandler, useRestoreBackup } from "@umami/state";
import { FormProvider, useForm } from "react-hook-form";

import { RotateIcon } from "../../../assets/icons";
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
  const restoreBackup = useRestoreBackup();

  const onSubmit = ({ file }: FormFields) =>
    handleAsyncAction(async () => {
      const fileContent = await file[0].text();
      const backup = JSON.parse(fileContent);
      restoreBackup(backup);
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
                <FormErrorMessage data-testid="file-errors">{errors.file.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginTop="24px">
              <PasswordInput
                data-testid="password-input"
                inputName="password"
                label="Your password (if you have one)"
                required={false}
              />
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
