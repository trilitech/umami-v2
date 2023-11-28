import { Button, Flex, Text } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import ContactTable from "./ContactTable";
import { useAllSortedContacts } from "../../utils/hooks/contactsHooks";
import { UpsertContactModal } from "../../components/ContactModal";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import AddContactIcon from "../../assets/icons/AddContact";

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
        openWith(<UpsertContactModal title="Add contact" buttonText="Add to Contact" />)
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

export default function AddressBookView() {
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
}
