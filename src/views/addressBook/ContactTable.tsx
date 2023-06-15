import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import { MdArrowOutward } from "react-icons/md";
import ContactMenu from "./ContactMenu";
import { useSendFormModal } from "../../views/home/useSendFormModal";
import { truncate } from "../../utils/format";

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const { modalElement, onOpen } = useSendFormModal();
  return (
    <>
      <TableContainer overflowX="unset" overflowY="unset">
        <Table>
          <Thead position="sticky" top={0} zIndex="docked" bg="umami.gray.900" borderRadius={4}>
            <Tr>
              <Th>Name:</Th>
              <Th>Address:</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map(contact => {
              return (
                <Tr key={contact.pkh} data-testid="contact-row">
                  <Td data-testid="contact-row-name" w="40%">
                    {truncate(contact.name, 55)}
                  </Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Flex alignItems="center">
                        <CopyableAddress
                          data-testid="contact-row-pkh"
                          width="345px"
                          mr={4}
                          justifyContent="space-between"
                          pkh={contact.pkh}
                          formatAddress={false}
                        />
                        <IconAndTextBtn
                          icon={MdArrowOutward}
                          label="Send"
                          onClick={() =>
                            onOpen({
                              recipient: contact.pkh,
                              mode: { type: "tez" },
                            })
                          }
                        />
                      </Flex>
                      <ContactMenu contact={contact} />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {modalElement}
    </>
  );
};

export default ContactTable;
