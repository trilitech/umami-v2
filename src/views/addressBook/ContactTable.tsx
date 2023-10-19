import { Box, Flex, Table, Text, Tbody, Td, Tr, TableContainer, Icon } from "@chakra-ui/react";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import { MdArrowOutward } from "react-icons/md";
import ContactMenu from "./ContactMenu";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import FormPage from "../../components/SendFlow/Tez/FormPage";
import colors from "../../style/colors";
import { RawPkh } from "../../types/Address";

const SendButton: React.FC<{ to: RawPkh }> = ({ to }) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Flex
      cursor="pointer"
      alignItems="center"
      mr="20px"
      onClick={() => openWith(<FormPage form={{ sender: "", recipient: to, prettyAmount: "" }} />)}
    >
      <Icon as={MdArrowOutward} color={colors.green} mr="4px" _hover={{ color: colors.greenL }} />
      <Text size="sm" color={colors.green} _hover={{ color: colors.greenL }}>
        Send
      </Text>
    </Flex>
  );
};

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  return (
    <Box bg={colors.gray[900]} overflow="auto">
      <TableContainer overflowX="unset" overflowY="unset">
        <Table>
          <Tbody>
            {contacts.map(contact => {
              return (
                <Tr key={contact.pkh} data-testid="contact-row">
                  <Td data-testid="contact-row-name">
                    <Text
                      fontWeight={600}
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      w="150px"
                    >
                      {contact.name}
                    </Text>
                  </Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="space-between">
                      <CopyableAddress
                        data-testid="contact-row-pkh"
                        width="345px"
                        mr={4}
                        justifyContent="space-between"
                        pkh={contact.pkh}
                        formatAddress={false}
                        iconColor={colors.gray[400]}
                      />

                      <Flex>
                        <SendButton to={contact.pkh} />
                        <ContactMenu contact={contact} />
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContactTable;
