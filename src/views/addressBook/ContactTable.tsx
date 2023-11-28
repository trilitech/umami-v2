import { Box, Flex, Table, Text, Tbody, Td, Tr, TableContainer } from "@chakra-ui/react";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import { useContext } from "react";
import { DynamicModalContext } from "../../components/DynamicModal";
import FormPage from "../../components/SendFlow/Tez/FormPage";
import colors from "../../style/colors";
import SendButton from "../../components/SendButton";
import RenameRemoveMenu from "../../components/RenameRemoveMenu";
import { DeleteContactModal, UpsertContactModal } from "../../components/ContactModal";

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Box overflow="auto" background={colors.gray[900]} borderRadius="8px" paddingX="30px">
      <TableContainer overflowX="unset" overflowY="unset">
        <Table>
          <Tbody>
            {contacts.map((contact, i) => {
              const rowBorderColor = i === contacts.length - 1 ? "transparent" : colors.gray[700];
              return (
                <Tr key={contact.pkh} data-testid="contact-row">
                  <Td borderColor={rowBorderColor} data-testid="contact-row-name" paddingX="0">
                    <Flex alignItems="center">
                      <Box width="150px" marginRight="40px">
                        <Text
                          overflow="hidden"
                          fontWeight={600}
                          whiteSpace="nowrap"
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
                  <Td borderColor={rowBorderColor} paddingX="0">
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
                      <RenameRemoveMenu
                        onRename={() => {
                          openWith(
                            <UpsertContactModal
                              title="Edit contact"
                              buttonText="Update"
                              contact={contact}
                            />
                          );
                        }}
                        onRemove={() => {
                          openWith(<DeleteContactModal contact={contact} />);
                        }}
                      />
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
