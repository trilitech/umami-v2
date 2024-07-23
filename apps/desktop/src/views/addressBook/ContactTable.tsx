import { Box, Flex, Table, TableContainer, Tbody, Td, Text, Tr } from "@chakra-ui/react";
import { DynamicDisclosureContext } from "@umami/components";
import { type Contact } from "@umami/core";
import { useContext } from "react";

import { CopyableAddress } from "../../components/CopyableText";
import { DeleteContactModal } from "../../components/DeleteContactModal";
import { RenameRemoveMenu } from "../../components/RenameRemoveMenu";
import { SendButton } from "../../components/SendButton";
import { FormPage } from "../../components/SendFlow/Tez/FormPage";
import { UpsertContactModal } from "../../components/UpsertContactModal";
import colors from "../../style/colors";

export const ContactTable = ({ contacts }: { contacts: Contact[] }) => {
  const { openWith } = useContext(DynamicDisclosureContext);
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
                        justifyContent="space-between"
                        data-testid="contact-row-pkh"
                        formatAddress={false}
                        iconColor={colors.gray[400]}
                        pkh={contact.pkh}
                      />
                    </Flex>
                  </Td>
                  <Td borderColor={rowBorderColor} paddingX="0">
                    <Flex justifyContent="end">
                      <SendButton
                        marginRight="20px"
                        onClick={() =>
                          openWith(
                            <FormPage
                              form={{ sender: "", recipient: contact.pkh, prettyAmount: "" }}
                            />
                          )
                        }
                      />
                      <RenameRemoveMenu
                        onRemove={() => openWith(<DeleteContactModal contact={contact} />)}
                        onRename={() => openWith(<UpsertContactModal contact={contact} />)}
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
