import {
  Button,
  Center,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type Contact } from "@umami/core";
import { contactsActions, useAppDispatch } from "@umami/state";

import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";
import { CopyAddressButton } from "../../CopyAddressButton";

type DeleteContactModalProps = {
  contact: Contact;
};

export const DeleteContactModal = ({ contact }: DeleteContactModalProps) => {
  const color = useColor();
  const dispatch = useAppDispatch();
  const { onClose } = useDynamicModalContext();
  const onDeleteContact = () => {
    dispatch(contactsActions.remove(contact.pkh));
    onClose();
  };

  const isLongAddress = useBreakpointValue({ base: false, md: true });

  return (
    <ModalContent>
      <ModalHeader>
        <Heading size="xl">Delete Contact</Heading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Center flexDirection="column" gap="6px">
          <Text
            width="full"
            maxWidth="340px"
            color={color("700")}
            fontWeight="400"
            textAlign="center"
            size="md"
          >
            Are you sure you want to delete this contact?
          </Text>
          <Heading marginTop="20px" color={color("900")} size="lg">
            {contact.name}
          </Heading>
          <CopyAddressButton address={contact.pkh} isLong={isLongAddress} />
        </Center>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={onDeleteContact} size="lg" variant="alert">
          Delete Contact
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
