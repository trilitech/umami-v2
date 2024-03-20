import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { FC, useContext } from "react";
import { useForm } from "react-hook-form";

import { Account } from "../../types/Account";
import { useValidateName } from "../../utils/hooks/labelsHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { renameAccount } from "../../utils/redux/thunks/renameAccount";
import { DynamicModalContext } from "../DynamicModal";
import { FormPageHeader } from "../SendFlow/FormPageHeader";

export const RenameAccountModal: FC<{
  account: Account;
}> = ({ account }) => {
  const dispatch = useAppDispatch();
  const { onClose } = useContext(DynamicModalContext);

  const onSubmitNewName = ({ name }: { name: string }) => {
    dispatch(renameAccount(account, name));
    onClose();
  };

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    reset,
  } = useForm<{ name: string }>({
    mode: "onBlur",
    defaultValues: { name: account.label },
  });
  const onSubmit = ({ name }: { name: string }) => {
    onSubmitNewName({ name: name.trim() });
    reset();
  };

  const validateName = useValidateName(account.label);

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormPageHeader subTitle="Edit your account name here." title="Edit Name" />
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name} marginY="20px">
            <FormLabel>Account name</FormLabel>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                validate: validateName,
              })}
              placeholder="Enter contact's name"
            />
            {errors.name && (
              <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button width="100%" marginBottom="8px" isDisabled={!isValid} size="lg" type="submit">
            Save
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
