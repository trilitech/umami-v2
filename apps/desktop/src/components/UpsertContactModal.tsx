import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type Contact } from "@umami/core";
import { getNetworksForContracts } from "@umami/multisig";
import {
  contactsActions,
  useAppDispatch,
  useAsyncActionHandler,
  useAvailableNetworks,
  useValidateName,
  useValidateNewContactPkh,
} from "@umami/state";
import { isValidContractPkh } from "@umami/tezos";
import { CustomError } from "@umami/utils";
import { type FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import { FormErrorMessage } from "./FormErrorMessage";

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
  const { handleAsyncAction } = useAsyncActionHandler();
  const dispatch = useAppDispatch();
  const { isOpen, onClose } = useDynamicModalContext();
  const availableNetworks = useAvailableNetworks();

  // When editing existing contact, its name & pkh are known and provided to the modal.
  const isEdit = !!(contact?.pkh && contact.name);

  const onSubmitContact = async (newContact: Contact) => {
    if (isValidContractPkh(newContact.pkh)) {
      await handleAsyncAction(async () => {
        const contractsWithNetworks = await getNetworksForContracts(availableNetworks, [
          newContact.pkh,
        ]);
        if (!contractsWithNetworks.has(newContact.pkh)) {
          throw new CustomError(`Network not found for contract ${newContact.pkh}`);
        }
        dispatch(
          contactsActions.upsert({
            ...newContact,
            network: contractsWithNetworks.get(newContact.pkh),
          })
        );
      });
    } else {
      dispatch(contactsActions.upsert({ ...newContact, network: undefined }));
    }
    onClose();
    reset();
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
    void onSubmitContact({ name: name.trim(), pkh });
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
