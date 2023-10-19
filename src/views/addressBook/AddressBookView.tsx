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
      variant="CTAWithIcon"
      onClick={() =>
        openWith(<UpsertContactModal title="Add contact" buttonText="Add to Contact" />)
      }
      alignItems="center"
      justifyContent="end"
      mb="16px"
      mt="16px"
      cursor="pointer"
    >
      <AddContactIcon stroke="currentcolor" />
      <Text size="sm" ml="4px">
        Add contact
      </Text>
    </Button>
  );
};

export default function AddressBookView() {
  const contacts = useAllSortedContacts();
  return (
    <Flex direction="column" height="100%">
      <TopBar title="Address Book" />

      <AddContact />
      <ContactTable contacts={contacts} />
    </Flex>
  );
}
