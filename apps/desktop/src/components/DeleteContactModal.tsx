import {
  Box,
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { DynamicDisclosureContext } from "@umami/components";
import { type Contact } from "@umami/core";
import { contactsActions, useAppDispatch } from "@umami/state";
import { type FC, useContext } from "react";

import { CopyableAddress } from "./CopyableText";
import colors from "../style/colors";

/**
 * Modal used for deleting existing contact.
 *
 * @param contact - contact that will be deleted.
 */

export const DeleteContactModal: FC<{
  contact: Contact;
}> = ({ contact }) => {
  const dispatch = useAppDispatch();
  const { onClose } = useContext(DynamicDisclosureContext);
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
