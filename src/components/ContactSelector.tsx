import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Contact } from "../types/Contact";
import { useAllSortedContacts } from "../utils/hooks/contactsHooks";

const ContactSelector: React.FC<{
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
        data-testid="account-selector"
        w={"100%"}
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedContact ? <>{selectedContact.name}</> : "Select an account"}
      </MenuButton>
      <MenuList bg={"umami.gray.900"}>
        {contacts.map((contact) => (
          <MenuItem
            value={contact.pkh}
            aria-label={contact.name}
            onClick={() => {
              onSelect(contact);
            }}
            key={contact.pkh}
            bg={"umami.gray.900"}
          >
            <>{contact.name}</>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ContactSelector;
