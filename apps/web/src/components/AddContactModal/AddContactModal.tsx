import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ModalBody,
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
import { type FC } from "react";
import { useForm } from "react-hook-form";

import { ModalCloseButton } from "../CloseButton";

export const AddContactModal: FC<{
  pkh?: string;
}> = ({ pkh }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const dispatch = useAppDispatch();
  const { onClose } = useDynamicModalContext();
  const availableNetworks = useAvailableNetworks();

  const onSubmitContact = async (newContact: Contact) => {
    if (isValidContractPkh(newContact.pkh)) {
      await handleAsyncAction(async () => {
        const contractsWithNetworks = await getNetworksForContracts(availableNetworks, [
          newContact.pkh,
        ]);
        if (!contractsWithNetworks.has(newContact.pkh)) {
          throw new Error(`Network not found for contract ${newContact.pkh}`);
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
    defaultValues: { pkh },
  });

  const onSubmit = ({ name, pkh }: Contact) => {
    void onSubmitContact({ name: name.trim(), pkh });
  };

  const validatePkh = useValidateNewContactPkh();
  const validateName = useValidateName();

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <Heading size="xl">Add Contact</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody gap="24px">
          <FormControl isInvalid={!!errors.name}>
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
          <FormControl isInvalid={!!errors.pkh}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              {...register("pkh", {
                required: "Address is required",
                validate: validatePkh,
              })}
              placeholder="Enter contact's tz address"
            />
            {errors.pkh && (
              <FormErrorMessage data-testid="address-error">{errors.pkh.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            width="100%"
            fontWeight="600"
            data-testid="confirmation-button"
            isDisabled={!isValid}
            size="lg"
            type="submit"
            variant="primary"
          >
            Add to Address Book
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
