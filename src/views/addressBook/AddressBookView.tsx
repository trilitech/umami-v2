import { Box, Flex } from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import ContactTable from "./ContactTable";
import { contacts } from "../../mocks/contacts";

const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} justifyContent="space-between" mb={4} mt={4}>
      <IconAndTextBtn icon={TbFilter} label="Filter" />

      <IconAndTextBtn
        icon={RiContactsLine}
        label="Add Contact"
        color={colors.greenL}
      />
    </Flex>
  );
};

export default function AddressBookView() {
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Address Book" />

      <FilterController />

      <Box overflow="scroll" pb={4}>
        {/* TODO: Use contacts data from redux */}
        <ContactTable contacts={Object.values(contacts())} />
      </Box>
    </Flex>
  );
}
