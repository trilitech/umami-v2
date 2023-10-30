import { FC, useContext } from "react";
import { Account } from "../../types/Account";
import { useAppDispatch } from "../../utils/redux/hooks";
import { DynamicModalContext } from "../DynamicModal";
import { useForm } from "react-hook-form";
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
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useContactExists } from "../../utils/hooks/contactsHooks";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import FormPageHeader from "../SendFlow/FormPageHeader";

export const RenameAccountModal: FC<{
  account: Account;
}> = ({ account }) => {
  const dispatch = useAppDispatch();
  const { onClose } = useContext(DynamicModalContext);

  const onSubmitNewName = ({ name }: { name: string }) => {
    if (account.type === "multisig") {
      // TODO: Rename multisig account
      return;
    }
    dispatch(accountsSlice.actions.renameAccount({ account, newName: name }));
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

  const accounts = useAllAccounts();
  const validateName = (name: string) => {
    if (accounts.map(account => account.label).includes(name)) {
      return "Name already used in accounts";
    }
    return !nameExistsInContacts(name.trim()) || "Name already registered in address book";
  };

  const { nameExistsInContacts } = useContactExists();

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormPageHeader title="Edit Name" subTitle="Edit your account name here." />
        <ModalCloseButton />
        <ModalBody>
          <FormControl marginY="20px" isInvalid={!!errors.name}>
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
          <Button width="100%" size="lg" type="submit" mb="8px" isDisabled={!isValid}>
            Save
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
