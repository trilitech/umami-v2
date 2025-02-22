/* istanbul ignore file */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { useAsyncActionHandler, useRestoreBackup } from "@umami/state";
import { useForm } from "react-hook-form";

import { persistor } from "../../utils/persistor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

type FormFields = {
  password: string;
  file: FileList;
};

export const ImportBackupModal = () => {
  const { handleSubmit, register } = useForm<FormFields>({ mode: "onBlur" });
  const { handleAsyncAction } = useAsyncActionHandler();
  const restoreBackup = useRestoreBackup();

  const onSubmit = ({ file, password }: FormFields) =>
    handleAsyncAction(async () => {
      const fileContent = await file[0].text();
      const backup = JSON.parse(fileContent);
      await restoreBackup(backup, password, persistor);
    });

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        Import backup
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl>
            <FormLabel>Backup file</FormLabel>
            <Input {...register("file")} placeholder="Enter your backup here" type="file" />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password")}
              placeholder="Enter your password here"
              type="password"
            />
          </FormControl>
          <Button width="100%" type="submit" variant="primary">
            Import backup
          </Button>
        </form>
      </ModalBody>
    </ModalContent>
  );
};
