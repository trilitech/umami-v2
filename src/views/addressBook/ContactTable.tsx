import { Box, Flex, Table, Text, Tbody, Td, Tr, TableContainer, Button } from "@chakra-ui/react";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import ContactMenu from "./ContactMenu";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import FormPage from "../../components/SendFlow/Tez/FormPage";
import colors from "../../style/colors";
import { RawPkh } from "../../types/Address";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";

const SendButton: React.FC<{ to: RawPkh }> = ({ to }) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Flex alignItems="center" mr="20px">
      <Button
        variant="specialCTA"
        width="60px"
        onClick={() =>
          openWith(<FormPage form={{ sender: "", recipient: to, prettyAmount: "" }} />)
        }
      >
        <OutgoingArrow stroke="currentcolor" />
        <Text ml="4px">Send</Text>
      </Button>
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
                  <Td data-testid="contact-row-name" pr="0px">
                    <Flex alignItems="center">
                      <Box w="150px" mr="20px">
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
                        w="340px"
                        justifyContent="space-between"
                        pkh={contact.pkh}
                        formatAddress={false}
                        iconColor={colors.gray[400]}
                      />
                    </Flex>
                  </Td>
                  <Td pl="0px">
                    <Flex justifyContent="end">
                      <SendButton to={contact.pkh} />
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
