import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import colors from "../style/colors";
import { Contact } from "../types/AddressBook";
import { useAddressInContacts } from "../utils/hooks/contactsHooks";

const ContactModal: FC<{
  title: string;
  buttonText: string;
  isOpen: boolean;
  prefilledContact?: Contact;
  onSubmitContact: (contact: Contact) => void;
  onClose: () => void;
}> = ({
  title,
  buttonText,
  prefilledContact,
  isOpen,
  onSubmitContact,
  onClose,
}) => {
  const { formState, register, handleSubmit, reset } = useForm<Contact>({
    mode: "onBlur",
    defaultValues: prefilledContact,
  });

  const onSubmit = (contact: Contact) => {
    onSubmitContact(contact);
    reset();
  };

  const { isValid } = formState;
  const addressInContact = useAddressInContacts();
  return (
    <>
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
                    validate: (val) =>
                      val.length === 36 && !addressInContact(val),
                  })}
                  placeholder="Enter contact’s tz address"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Box width={"100%"}>
                <Button
                  width={"100%"}
                  type="submit"
                  mb={2}
                  isDisabled={!isValid}
                >
                  {buttonText}
                </Button>
              </Box>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ContactModal;
