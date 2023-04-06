import {
  Box,
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { Contact } from "../../types/AddressBook";
import { CopyableAddress } from "../../components/CopyableText";
import { MdArrowOutward } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";

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

const AddressBookTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  return (
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
        {
          // Finally a way to have a sticky Header
          // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
        }
        <Thead
          position="sticky"
          top={0}
          zIndex="docked"
          bg="umami.gray.900"
          borderRadius={4}
        >
          <Tr>
            <Th>Name:</Th>
            <Th>Address:</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contacts.map((contact) => {
            return (
              <Tr key={contact.pkh}>
                <Td>{contact.name}</Td>
                <Td>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      <CopyableAddress
                        pkh={contact.pkh}
                        formatAddress={false}
                        mr={5}
                      />
                      <IconAndTextBtn icon={MdArrowOutward} label="Send" />
                    </Flex>
                    <Tooltip hasArrow label="Search places" bg="red.600">
                      <Icon
                        as={BsThreeDots}
                        color={colors.gray[600]}
                        _hover={{
                          color: colors.gray[300],
                        }}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
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
