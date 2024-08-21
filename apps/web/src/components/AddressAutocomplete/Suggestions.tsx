import { Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { type Contact } from "@umami/core";
import { parsePkh } from "@umami/tezos";

import { useColor } from "../../styles/useColor";
import { AddressTile } from "../AddressTile/AddressTile";

export const Suggestions = ({
  contacts,
  onChange,
}: {
  contacts: Contact[];
  onChange: (name: string) => void;
}) => {
  const color = useColor();
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
      background={color("white")}
      border="1px solid"
      borderColor={color("400")}
      borderRadius="8px"
      transform={{ base: "translateY(calc(-100% - 66px))", lg: "unset" }}
      data-testid="suggestions-list"
      listStyleType="none"
    >
      {contacts.map((contact, i) => (
        <Box key={contact.pkh}>
          <ListItem
            marginBottom={i === contacts.length - 1 ? "5px" : 0}
            data-testid={`suggestion-${contact.pkh}`}
            onMouseDown={() => {
              // onMouseDown is the only way for this to fire before the onBlur callback of the Input
              // https://stackoverflow.com/a/28963938/6797267
              onChange(contact.pkh);
            }}
          >
            <AddressTile
              background="none"
              borderRadius="0"
              _hover={{
                background: color("100"),
              }}
              cursor="pointer"
              address={parsePkh(contact.pkh)}
              size="xs"
            />
          </ListItem>
        </Box>
      ))}
    </UnorderedList>
  );
};
