import { Box, Flex, Table, Text, Tbody, Td, Tr, TableContainer } from "@chakra-ui/react";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import ContactMenu from "./ContactMenu";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import FormPage from "../../components/SendFlow/Tez/FormPage";
import colors from "../../style/colors";
import SendButton from "../../components/SendButton";

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Box bg={colors.gray[900]} overflow="auto" borderRadius="8px" px="30px">
      <TableContainer overflowX="unset" overflowY="unset">
        <Table>
          <Tbody>
            {contacts.map((contact, i) => {
              const rowBorderColor = i === contacts.length - 1 ? "transparent" : colors.gray[700];
              return (
                <Tr key={contact.pkh} data-testid="contact-row">
                  <Td data-testid="contact-row-name" borderColor={rowBorderColor} px="0">
                    <Flex alignItems="center">
                      <Box w="150px" mr="40px">
                        <Text
                          fontWeight={600}
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {contact.name}
                        </Text>
                      </Box>
                      <CopyableAddress
                        data-testid="contact-row-pkh"
                        justifyContent="space-between"
                        pkh={contact.pkh}
                        formatAddress={false}
                        iconColor={colors.gray[400]}
                      />
                    </Flex>
                  </Td>
                  <Td borderColor={rowBorderColor} px="0">
                    <Flex justifyContent="end">
                      <SendButton
                        mr="20px"
                        onClick={() =>
                          openWith(
                            <FormPage
                              form={{ sender: "", recipient: contact.pkh, prettyAmount: "" }}
                            />
                          )
                        }
                      />
                      <ContactMenu contact={contact} />
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
