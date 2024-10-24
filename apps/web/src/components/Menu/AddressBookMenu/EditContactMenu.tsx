import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";
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
import { type FC } from "react";
import { useForm } from "react-hook-form";

import { DrawerContentWrapper } from "../DrawerContentWrapper";

/**
 * Modal used for both adding new contacts & editing existing contacts.
 *
 * Contact is checked for having unique name & pkh (among all accounts & other contacts) before being added.
 *
 * @param contact - optional / partial data for creating new contact, or full data for editing existing contact.
 */
export const EditContactMenu: FC<{
  contact?: Contact;
}> = ({ contact }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const dispatch = useAppDispatch();
  const { goBack } = useDynamicDrawerContext();
  const availableNetworks = useAvailableNetworks();

  // When editing existing contact, its name & pkh are known and provided to the modal.
  const isEdit = !!(contact?.pkh && contact.name);

  const onSubmitContact = async (newContact: Contact) => {
    await handleAsyncAction(async () => {
      let network: string | undefined;

      if (isValidContractPkh(newContact.pkh)) {
        const contractsWithNetworks = await getNetworksForContracts(availableNetworks, [
          newContact.pkh,
        ]);

        network = contractsWithNetworks.get(newContact.pkh);

        if (!network) {
          throw new Error(`Network not found for contract ${newContact.pkh}`);
        }
      }

      dispatch(contactsActions.upsert({ ...newContact, network }));
      goBack();
    });
  };

  const {
    handleSubmit,
    formState: { isValid, errors },
    register,
  } = useForm<Contact>({
    mode: "onBlur",
    defaultValues: contact,
  });

  const validatePkh = useValidateNewContactPkh();
  const validateName = useValidateName(contact?.name);

  return (
    <DrawerContentWrapper title={isEdit ? "Edit Contact" : "Add Contact"}>
      <form onSubmit={handleSubmit(({ name, pkh }) => onSubmitContact({ name: name.trim(), pkh }))}>
        <VStack gap="30px" marginTop="40px" spacing="0">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              {...register("name", {
                required: "Name is required",
                validate: validateName,
              })}
              placeholder="Contact's name"
            />
            {errors.name && (
              <FormErrorMessage data-testid="name-error">{errors.name.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.pkh}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              {...register("pkh", {
                required: "Address is required",
                validate: isEdit ? () => true : validatePkh,
              })}
              disabled={isEdit}
              placeholder="Contact's tz address"
              variant={isEdit ? "filled" : undefined}
            />
            {errors.pkh && (
              <FormErrorMessage data-testid="address-error">{errors.pkh.message}</FormErrorMessage>
            )}
          </FormControl>
        </VStack>
        <Button
          width="full"
          marginTop="30px"
          data-testid="confirmation-button"
          isDisabled={!isValid}
          size="lg"
          type="submit"
          variant="primary"
        >
          {isEdit ? "Update" : "Add Contact"}
        </Button>
      </form>
    </DrawerContentWrapper>
  );
};
