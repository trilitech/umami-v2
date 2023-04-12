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
} from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import colors from "../style/colors";
import { Contact } from "../types/AddressBook";
import { useContactAlreadyExists } from "../utils/hooks/contactsHooks";
import { contactsActions } from "../utils/store/contactsSlice";
import { useAppDispatch } from "../utils/store/hooks";
import { CopyableAddress } from "./CopyableText";

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
  const { handleSubmit, formState, register, reset, getValues } =
    useForm<Contact>({
      mode: "onBlur",
      defaultValues: contactToEdit,
    });

  const onSubmit = (contact: Contact) => {
    onSubmitContact(contact);
    reset();
  };

  const { isValid } = formState;
  const contactAlreadyExists = useContactAlreadyExists();
  const validateAddress = (pkh: string) => {
    // TODO: Use taquito to validate the address.
    const validAddress = pkh.length === 36;
    if (contactToEdit) {
      return validAddress && getValues("name") !== contactToEdit.name;
    }
    return validAddress && !contactAlreadyExists(pkh);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colors.gray[900]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader textAlign={"center"}>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl marginY={5}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register("name", {
                  required: true,
                })}
                placeholder="Enter contact’s name"
              />
            </FormControl>
            <FormControl marginY={5}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                {...register("pkh", {
                  required: true,
                  validate: validateAddress,
                })}
                value={contactToEdit?.pkh}
                variant={contactToEdit ? "filled" : undefined}
                disabled={!!contactToEdit}
                placeholder="Enter contact’s tz address"
              />
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
