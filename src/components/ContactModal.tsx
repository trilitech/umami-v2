import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import colors from "../style/colors";
import { Contact } from "../types/Contact";
import { useAccounts, useGetAccount } from "../utils/hooks/accountHooks";
import { useContactExists } from "../utils/hooks/contactsHooks";
import { contactsActions } from "../utils/store/contactsSlice";
import { useAppDispatch } from "../utils/store/hooks";
import { addressIsValid } from "../utils/tezos/pureTezosUtils";
import { CopyableAddress } from "./CopyableText";

export const UpsertContactModal: FC<{
  title: string;
  buttonText: string;
  isOpen: boolean;
  isEdit?: boolean;
  contact?: Contact; // For updating an existing contact
  onSubmitContact: (contact: Contact) => void;
  onClose: () => void;
}> = ({
  title,
  buttonText,
  contact,
  isOpen,
  isEdit = false,
  onSubmitContact,
  onClose,
}) => {
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

  const accounts = useAccounts();
  const validateName = (name: string) => {
    if (accounts.map((account) => account.label).includes(name)) {
      return "Name already used in accounts";
    }
    return !nameExistsInContacts(name.trim()) || "Name already registered";
  };

  const { nameExistsInContacts, addressExistsInContacts } = useContactExists();
  const getAccount = useGetAccount();
  const validatePkh = (pkh: string) => {
    if (!addressIsValid(pkh)) {
      return "Invalid address";
    }
    if (isEdit && contact) {
      return getValues("name") !== contact.name;
    }

    if (getAccount(pkh)) {
      return "Address already used in accounts";
    }

    return !addressExistsInContacts(pkh) || "Address already registered";
  };

  useEffect(() => {
    reset(contact);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, contact?.name]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colors.gray[900]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader textAlign={"center"}>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl marginY={5} isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register("name", {
                  required: true,
                  validate: validateName,
                })}
                placeholder="Enter contact’s name"
              />
              {errors.name && (
                <FormErrorMessage>{errors.name.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginY={5} isInvalid={!!errors.pkh}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                {...register("pkh", {
                  required: true,
                  validate: validatePkh,
                })}
                value={contact?.pkh}
                variant={contact ? "filled" : undefined}
                disabled={isEdit}
                placeholder="Enter contact’s tz address"
              />
              {errors.pkh && (
                <FormErrorMessage>{errors.pkh.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Box width={"100%"}>
              <Button width={"100%"} type="submit" mb={2} isDisabled={!isValid}>
                {buttonText}
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const DeleteContactModal: FC<{
  isOpen: boolean;
  contact: Contact;
  onClose: () => void;
}> = ({ contact, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const onDeleteContact = () => {
    dispatch(contactsActions.remove(contact.pkh));
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colors.gray[900]}>
        <ModalHeader textAlign={"center"}>Delete Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            direction="column"
            justifyContent="space-between"
          >
            <Text size="sm" color={colors.gray[400]}>
              Are you sure you want to delete this contact?
            </Text>
            <Box mt={5}>
              <Heading size="md" textAlign="center" mb={3}>
                {contact.name}
              </Heading>
              <CopyableAddress pkh={contact.pkh} />
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Box width={"100%"}>
            <Button width={"100%"} onClick={onDeleteContact} mb={2}>
              Delete
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
