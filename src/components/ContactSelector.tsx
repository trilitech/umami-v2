import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FC } from "react";
import colors from "../style/colors";
import { Contact } from "../types/Contact";
import { useAllSortedContacts } from "../utils/hooks/contactsHooks";
import { CopyableAddress } from "./CopyableText";

const ContactSmallTile: FC<{ contact: Contact }> = ({ contact }) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      data-testid="contact-small-tile"
    >
      <Heading size="sm" mr={5}>
        {contact.name}
      </Heading>
      <CopyableAddress pkh={contact.pkh} copyable={false} />
    </Flex>
  );
};

const ContactSelector: FC<{
  onSelect: (a: Contact) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ onSelect = () => {}, selected, isDisabled }) => {
  const contacts = useAllSortedContacts();
  const selectedContact = contacts.find((c) => c.pkh === selected);

  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        w={"100%"}
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h="48px"
        data-testid="contact-selector"
      >
        {selectedContact ? (
          <ContactSmallTile contact={selectedContact} />
        ) : (
          "Select a contact"
        )}
      </MenuButton>
      <MenuList w="100%" bg={"umami.gray.900"} overflow="scroll" h="110px">
        {contacts.map((contact) => (
          <MenuItem
            w="100%"
            value={contact.pkh}
            aria-label={contact.name}
            onClick={() => {
              onSelect(contact);
            }}
            key={contact.pkh}
            // TODO implement hover color
            // https://app.asana.com/0/1204165186238194/1204412123679802/f
            bg={colors.gray[900]}
          >
            <ContactSmallTile contact={contact} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ContactSelector;
