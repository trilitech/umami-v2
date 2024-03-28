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
import { isValidContractPkh } from "../types/Address";
import { Contact } from "../types/Contact";
import { useValidateNewContactPkh } from "../utils/hooks/contactsHooks";
import { useValidateName } from "../utils/hooks/labelsHooks";
import { useAvailableNetworks } from "../utils/hooks/networkHooks";
import { getNetworksForContracts } from "../utils/multisig/helpers";
import { useAppDispatch } from "../utils/redux/hooks";
import { contactsActions } from "../utils/redux/slices/contactsSlice";

/**
 * Modal used for both adding new contacts & editing existing contacts.
 *
 * Contact is checked for having unique name & pkh (among all accounts & other contacts) before being added.
 *
 * @param contact - optional / partial data for creating new contact, or full data for editing existing contact.
 */
export const UpsertContactModal: FC<{
  contact?: Contact;
}> = ({ contact }) => {
  const dispatch = useAppDispatch();
  const { isOpen, onClose } = useContext(DynamicModalContext);
  const availableNetworks = useAvailableNetworks();

  // When editing existing contact, its name & pkh are known and provided to the modal.
  const isEdit = !!(contact?.pkh && contact.name);

  const onSubmitContact = async (newContact: Contact) => {
    if (isValidContractPkh(newContact.pkh)) {
      const contractsWithNetworks = await getNetworksForContracts(
        availableNetworks,
        new Set(newContact.pkh)
      );
      if (!contractsWithNetworks.has(newContact.pkh)) {
        throw new Error(`Network not found for contract ${newContact.pkh}`);
      }
      dispatch(
        contactsActions.upsert({
          ...newContact,
          network: contractsWithNetworks.get(newContact.pkh),
        })
      );
    } else {
      dispatch(contactsActions.upsert({ ...newContact, network: undefined }));
    }
    onClose();
  };

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
    reset,
  } = useForm<Contact>({
    mode: "onBlur",
    defaultValues: contact,
  });

  const onSubmit = ({ name, pkh }: Contact) => {
    void onSubmitContact({ name: name.trim(), pkh }).then(() => reset);
  };

  const resetRef = useRef(reset);
  useEffect(() => {
    // Refresh form with contact values when modal opens
    if (isOpen) {
      resetRef.current(contact);
    }
  }, [isOpen, contact]);

  const validatePkh = useValidateNewContactPkh();
  const validateName = useValidateName(contact?.name);

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader textAlign="center">{isEdit ? "Edit Contact" : "Add Contact"}</ModalHeader>
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
            {errors.name && (
              <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.pkh} marginY={5}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              {...register("pkh", {
                required: "Address is required",
                validate: isEdit ? () => true : validatePkh,
              })}
              disabled={isEdit}
              placeholder="Enter contact's tz address"
              variant={isEdit ? "filled" : undefined}
            />
            {errors.pkh && (
              <FormErrorMessage data-testid="address-error">{errors.pkh.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter padding="16px 0 0 0">
          <Box width="100%">
            <Button
              width="100%"
              marginBottom={2}
              data-testid="confirmation-button"
              isDisabled={!isValid}
              size="lg"
              type="submit"
            >
              {isEdit ? "Update" : "Add to Address Book"}
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

/**
 * Modal used for deleting existing contact.
 *
 * @param contact - contact that will be deleted.
 */
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
            Are you sure you want to delete this contact?
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
            Delete Contact
          </Button>
        </Box>
      </ModalFooter>
    </ModalContent>
  );
};
