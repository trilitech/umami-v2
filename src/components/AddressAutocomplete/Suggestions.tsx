import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { Contact } from "../../types/Contact";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import AddressTile from "../AddressTile/AddressTile";

export const Suggestions = ({
  contacts,
  onChange,
}: {
  contacts: Contact[];
  onChange: (name: string) => void;
}) => {
  if (contacts.length === 0) {
    return null;
  }

  return (
    <UnorderedList
      data-testid="suggestions-list"
      overflowY="auto"
      mt="8px"
      ml={0}
      width="100%"
      borderRadius="8px"
      listStyleType="none"
      position="absolute"
      border="1px solid"
      borderColor={colors.gray[500]}
      bg={colors.gray[700]}
      zIndex={2}
      maxHeight={300}
    >
      {contacts.map((contact, i) => (
        <Box key={contact.pkh}>
          <ListItem
            onMouseDown={() => {
              // onMouseDown is the only way for this to fire before the onBlur callback of the Input
              // https://stackoverflow.com/a/28963938/6797267
              onChange(contact.name);
            }}
            padding="5px 15px 0 5px"
            mb={i === contacts.length - 1 ? "5px" : 0}
          >
            <AddressTile
              cursor="pointer"
              address={parsePkh(contact.pkh)}
              _hover={{
                background: colors.gray[500],
              }}
              background={colors.gray[700]}
              width="370px"
              borderRadius="4px"
              padding="10px 8px 10px 5px"
              height="40px"
            />
          </ListItem>
        </Box>
      ))}
    </UnorderedList>
  );
};
