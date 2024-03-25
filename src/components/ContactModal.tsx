import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { FC, useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { CopyableAddress } from "./CopyableText";
import { DynamicModalContext } from "./DynamicModal";
import { FormErrorMessage } from "./FormErrorMessage";
import colors from "../style/colors";
import { isAddressValid } from "../types/Address";
import { Contact } from "../types/Contact";
import { useContactExists } from "../utils/hooks/contactsHooks";
import { useAllAccounts, useGetOwnedAccountSafe } from "../utils/hooks/getAccountDataHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { contactsActions } from "../utils/redux/slices/contactsSlice";

export const UpsertContactModal: FC<{
  title: string;
  buttonText: string;
  contact?: Contact; // For updating an existing contact
}> = ({ title, buttonText, contact }) => {
  const dispatch = useAppDispatch();
  const getAccount = useGetOwnedAccountSafe();
  const { isOpen, onClose } = useContext(DynamicModalContext);

  const onSubmitContact = (newContact: Contact) => {
    if (getAccount(newContact.pkh)) {
      return;
    }
    dispatch(contactsActions.upsert(newContact));
    onClose();
  };

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    reset,
    getValues,
  } = useForm<Contact>({
    mode: "onBlur",
    defaultValues: contact,
  });
  const onSubmit = ({ name, pkh }: Contact) => {
    onSubmitContact({ name: name.trim(), pkh });
    reset();
  };

  const isEdit = contact !== undefined;

  const accounts = useAllAccounts();
  const validateName = (name: string) => {
    if (accounts.map(account => account.label).includes(name)) {
      return "Name already used in accounts";
    }
    return !nameExistsInContacts(name.trim()) || "Name already registered";
  };

  const { nameExistsInContacts, addressExistsInContacts } = useContactExists();

  const validatePkh = (pkh: string) => {
    if (!isAddressValid(pkh)) {
      return "Invalid address";
    }
    if (isEdit) {
      return getValues("name") !== contact.name;
    }

    if (getAccount(pkh)) {
      return "Address already used in accounts";
    }

    return !addressExistsInContacts(pkh) || "Address already registered";
  };

  const resetRef = useRef(reset);
  useEffect(() => {
    // Refresh form with contact values when modal opens
    if (isOpen) {
      resetRef.current(contact);
    }
  }, [isOpen, contact]);

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.name} marginY={5}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                validate: validateName,
              })}
              placeholder="Enter contact's name"
            />
            {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.pkh} marginY={5}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              {...register("pkh", {
                required: "Address is required",
                validate: validatePkh,
              })}
              disabled={isEdit}
              placeholder="Enter contact’s tz address"
              value={contact?.pkh}
              variant={isEdit ? "filled" : undefined}
            />
            {errors.pkh && <FormErrorMessage>{errors.pkh.message}</FormErrorMessage>}
          </FormControl>
        </ModalBody>

        <ModalFooter padding="16px 0 0 0">
          <Box width="100%">
            <Button width="100%" marginBottom={2} isDisabled={!isValid} size="lg" type="submit">
              {buttonText}
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export const DeleteContactModal: FC<{
  contact: Contact;
}> = ({ contact }) => {
  const dispatch = useAppDispatch();
  const { onClose } = useContext(DynamicModalContext);
  const onDeleteContact = () => {
    dispatch(contactsActions.remove(contact.pkh));
    onClose();
  };
  return (
    <ModalContent>
      <ModalHeader marginBottom="10px" textAlign="center">
        Delete Contact
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Flex alignItems="center" justifyContent="space-between" flexDirection="column">
          <Text color={colors.gray[400]} size="sm">
            Are you sure you want to remove this contact?
          </Text>
          <Box marginTop={5}>
            <Heading marginBottom={3} textAlign="center" size="md">
              {contact.name}
            </Heading>
            <CopyableAddress pkh={contact.pkh} />
          </Box>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Box width="100%">
          <Button width="100%" marginBottom={2} onClick={onDeleteContact} variant="warning">
            Delete
          </Button>
        </Box>
      </ModalFooter>
    </ModalContent>
  );
};