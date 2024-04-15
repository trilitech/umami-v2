import { Box, ListItem, UnorderedList } from "@chakra-ui/react";

import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { Contact } from "../../types/Contact";
import { AddressTile } from "../AddressTile/AddressTile";

export const Suggestions = ({
  contacts,
  hideBalance,
  onChange,
}: {
  contacts: Contact[];
  hideBalance: boolean;
  onChange: (name: string) => void;
}) => {
  if (contacts.length === 0) {
    return null;
  }

  return (
    <UnorderedList
      position="absolute"
      zIndex={2}
      overflowY="auto"
      width="100%"
      maxHeight="300px"
      marginTop="8px"
      marginLeft={0}
      background={colors.gray[700]}
      border="1px solid"
      borderColor={colors.gray[500]}
      borderRadius="8px"
      data-testid="suggestions-list"
      listStyleType="none"
    >
      {contacts.map((contact, i) => (
        <Box key={contact.pkh}>
          <ListItem
            marginBottom={i === contacts.length - 1 ? "5px" : 0}
            padding="5px 15px 0 5px"
            onMouseDown={() => {
              // onMouseDown is the only way for this to fire before the onBlur callback of the Input
              // https://stackoverflow.com/a/28963938/6797267
              onChange(contact.name);
            }}
          >
            <AddressTile
              height="40px"
              padding="10px 8px 10px 5px"
              background={colors.gray[700]}
              borderRadius="4px"
              _hover={{
                background: colors.gray[500],
              }}
              cursor="pointer"
              address={parsePkh(contact.pkh)}
              hideBalance={hideBalance}
            />
          </ListItem>
        </Box>
      ))}
    </UnorderedList>
  );
};
