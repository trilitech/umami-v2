import {
  Box,
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import colors from "../style/colors";
import { Contact } from "../types/Contact";
import { useContactAlreadyExists } from "../utils/hooks/contactsHooks";
import { contactsActions } from "../utils/store/contactsSlice";
import { useAppDispatch } from "../utils/store/hooks";
import { CopyableAddress } from "./CopyableText";
import { validateAddress, ValidationResult } from "@taquito/utils";

export const UpsertContactModal: FC<{
  title: string;
  buttonText: string;
  isOpen: boolean;
  contactToEdit?: Contact; // For updating an existing contact
  onSubmitContact: (contact: Contact) => void;
  onClose: () => void;
}> = ({
  title,
  buttonText,
  contactToEdit,
  isOpen,
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
    defaultValues: contactToEdit,
  });
  const onSubmit = ({ name, pkh }: Contact) => {
    onSubmitContact({ name: name.trim(), pkh });
    reset();
  };

  const contactAlreadyExists = useContactAlreadyExists();
  const validatePkh = (pkh: string) => {
    const validationResult = validateAddress(pkh);
    if (validationResult !== ValidationResult.VALID) {
      return "Invalid address";
    }
    if (contactToEdit) {
      return getValues("name") !== contactToEdit.name;
    }
    return !contactAlreadyExists(pkh) || "Address already exists";
  };

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
                  maxLength: 20,
                })}
                placeholder="Enter contact’s name"
              />
              {errors.name && (
                <FormErrorMessage>Name too long </FormErrorMessage>
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
                value={contactToEdit?.pkh}
                variant={contactToEdit ? "filled" : undefined}
                disabled={!!contactToEdit}
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
