import { Box, Flex } from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ContactTable from "./ContactTable";
import { useAllSortedContacts } from "../../utils/hooks/contactsHooks";
import { useUpsertContactModal } from "../home/useUpsertContactModal";

const FilterController: React.FC = () => {
  const { modalElement, onOpen } = useUpsertContactModal();

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
        onClick={() => onOpen()}
      />

      {modalElement}
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
