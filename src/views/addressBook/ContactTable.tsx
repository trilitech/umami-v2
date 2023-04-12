import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import { MdArrowOutward } from "react-icons/md";
import PopoverThreeDots from "./PopoverThreeDots";

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  return (
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
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
                        width="330px"
                        mr={4}
                        justifyContent="space-between"
                        pkh={contact.pkh}
                        formatAddress={false}
                      />
                      <IconAndTextBtn icon={MdArrowOutward} label="Send" />
                    </Flex>
                    <PopoverThreeDots contact={contact} />
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

export default ContactTable;
