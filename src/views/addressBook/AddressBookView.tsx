import { Box, Flex } from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import AddressBookTable from "./ContactTable";

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

const fixture = [
  {
    name: "Lewis Hatfull",
    pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
  {
    name: "Lev Kowalski",
    pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
  {
    name: "Abhishek Jain",
    pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
  {
    name: "Fabrice Trutmann",
    pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  },
];
export default function AddressBookView() {
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Address Book" />

      <FilterController />

      <Box overflow="scroll" pb={4}>
        <AddressBookTable contacts={fixture} />
      </Box>
    </Flex>
  );
}
