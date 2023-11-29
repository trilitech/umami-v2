import { Button, Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { ContactTable } from "./ContactTable";
import { AddContactIcon } from "../../assets/icons";
import { UpsertContactModal } from "../../components/ContactModal";
import { DynamicModalContext } from "../../components/DynamicModal";
import { TopBar } from "../../components/TopBar";
import { useAllSortedContacts } from "../../utils/hooks/contactsHooks";

const AddContact: React.FC = () => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Button
      alignItems="center"
      justifyContent="end"
      marginTop="16px"
      marginBottom="16px"
      cursor="pointer"
      onClick={() =>
        openWith(<UpsertContactModal buttonText="Add to Contact" title="Add contact" />)
      }
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
  const contacts = useAllSortedContacts();
  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Address Book" />

      <Flex flexDirection="row-reverse">
        <AddContact />
      </Flex>
      <ContactTable contacts={contacts} />
    </Flex>
  );
};
