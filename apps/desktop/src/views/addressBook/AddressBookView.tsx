import { Button, Flex, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useSortedContacts } from "@umami/state";

import { ContactTable } from "./ContactTable";
import { AddContactIcon } from "../../assets/icons";
import { NoItems } from "../../components/NoItems";
import { TopBar } from "../../components/TopBar";
import { UpsertContactModal } from "../../components/UpsertContactModal";

const AddContact = () => {
  const { openWith } = useDynamicModalContext();
  return (
    <Button
      alignItems="center"
      justifyContent="end"
      marginTop="16px"
      marginBottom="16px"
      cursor="pointer"
      onClick={() => openWith(<UpsertContactModal />)}
      variant="CTAWithIcon"
    >
      <AddContactIcon stroke="currentcolor" />
      <Text marginLeft="4px" size="sm">
        Add contact
      </Text>
    </Button>
  );
};

export const AddressBookView = () => {
  const contacts = useSortedContacts();
  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Address Book" />

      <Flex flexDirection="row-reverse">
        <AddContact />
      </Flex>

      {contacts.length > 0 ? (
        <ContactTable contacts={contacts} />
      ) : (
        <NoItems
          description="Your contacts will appear here..."
          size="lg"
          title="Your address book is empty"
        />
      )}
    </Flex>
  );
};
