import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ContactTable from "./ContactTable";
import { Contact } from "../../types/AddressBook";
import { UpsertContactModal } from "../../components/ContactModal";
import { useAllSortedContacts } from "../../utils/hooks/contactsHooks";
import { contactsActions } from "../../utils/store/contactsSlice";
import { useAppDispatch } from "../../utils/store/hooks";

const FilterController: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const onAddContact = (newContact: Contact) => {
    dispatch(contactsActions.upsert(newContact));
    onClose();
  };

  return (
    <Flex alignItems={"center"} justifyContent="space-between" mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" />

      <IconAndTextBtn
        icon={RiContactsLine}
        label="Add Contact"
        color={colors.green}
        cursor="pointer"
        _hover={{
          color: colors.greenL,
        }}
        onClick={onOpen}
      />

      <UpsertContactModal
        title="Add Contact"
        buttonText="Add to Contact"
        isOpen={isOpen}
        onSubmitContact={onAddContact}
        onClose={onClose}
      />
    </Flex>
  );
};

export default function AddressBookView() {
  const contacts = useAllSortedContacts();
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Address Book" />

      <FilterController />
      <Box overflow="scroll" pb={4}>
        <ContactTable contacts={contacts} />
      </Box>
    </Flex>
  );
}
