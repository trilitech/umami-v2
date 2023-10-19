import { Flex, IconButton, Text } from "@chakra-ui/react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ContactTable from "./ContactTable";
import { useAllSortedContacts } from "../../utils/hooks/contactsHooks";
import { UpsertContactModal } from "../../components/ContactModal";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import AddContactIcon from "../../assets/icons/AddContact";

const AddContact: React.FC = () => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Flex alignItems="center" justifyContent="end" mb="16px" mt="16px" cursor="pointer">
      <IconButton
        aria-label="add contact"
        variant="specialCTA"
        onClick={() =>
          openWith(<UpsertContactModal title="Add contact" buttonText="Add to Contact" />)
        }
        icon={<AddContactIcon stroke="currentcolor" />}
      />

      <Text
        color={colors.greenL}
        _hover={{
          color: colors.green,
        }}
      >
        Add contact
      </Text>
    </Flex>
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
