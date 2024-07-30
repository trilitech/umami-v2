/* istanbul ignore file */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useAsyncActionHandler, useRestoreBackup } from "@umami/state";
import { useForm } from "react-hook-form";

import { persistor } from "../../utils/persistor";
import { ModalBackButton } from "../Onboarding/ModalBackButton";

type FormFields = {
  password: string;
  file: FileList;
};

export const ImportBackupModal = () => {
  const { handleSubmit, register } = useForm<FormFields>({ mode: "onBlur" });
  const { handleAsyncAction } = useAsyncActionHandler();
  const restoreBackup = useRestoreBackup();
  const { goBack } = useDynamicModalContext();

  const onSubmit = ({ file, password }: FormFields) =>
    handleAsyncAction(async () => {
      const fileContent = await file[0].text();
      const backup = JSON.parse(fileContent);
      await restoreBackup(backup, password, persistor);
    });

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton aria-label="Go back" onClick={goBack} />
        <ModalCloseButton />
        Import Backup
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <FormControl>
            <FormLabel>Backup File</FormLabel>
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
          <Button width="100%" size="lg" type="submit" variant="primary">
            Import Backup
          </Button>
        </form>
      </ModalBody>
    </ModalContent>
  );
};
