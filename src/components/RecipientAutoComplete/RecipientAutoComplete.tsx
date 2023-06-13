import { Box, Divider, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React, { useState } from "react";
import { Noop } from "react-hook-form";
import colors from "../../style/colors";
import { Contact } from "../../types/Contact";
import { useAllAccounts, useImplicitAccounts } from "../../utils/hooks/accountHooks";
import { useAppSelector } from "../../utils/store/hooks";
import { addressIsValid } from "../../utils/tezos/pureTezosUtils";
import { Identicon } from "../Identicon";

type BaseProps = {
  onValidPkh: (v: string | null) => void;
  initialPkhValue?: string;
  isDisabled?: boolean;
  onBlur?: Noop;
};

const getSuggestions = (inputValue: string, contacts: Contact[]): Contact[] => {
  if (inputValue === "") {
    return contacts;
  }

  const result = contacts.filter(c =>
    c.name.toLowerCase().includes(inputValue.trim().toLowerCase())
  );

  // No suggestions if it's an exact match
  if (result.length === 1 && result[0].name === inputValue) {
    return [];
  }

  return result;
};

const Suggestions = ({
  hideSuggestions,
  suggestions,
  onChange,
}: {
  hideSuggestions: boolean;
  suggestions: Contact[];
  onChange: (name: string) => void;
}) => {
  const hide = hideSuggestions || suggestions.length === 0;

  return hide ? null : (
    <UnorderedList
      overflow={"scroll"}
      mt={2}
      ml={0}
      width="100%"
      borderRadius={8}
      listStyleType="none"
      position={"absolute"}
      bg="umami.gray.500"
      zIndex={2}
      maxHeight={300}
    >
      {suggestions.map((s, i) => (
        <Box key={s.pkh}>
          <ListItem
            display={"flex"}
            _hover={{
              background: colors.gray[600],
            }}
            alignItems="center"
            pl={4}
            pr={4}
            h={12}
            cursor="pointer"
            onMouseDown={() => {
              // onMouseDown is the only way for this to fire before the onBlur callback of the Input
              // https://stackoverflow.com/a/28963938/6797267
              onChange(s.name);
            }}
          >
            <>
              <Identicon identiconSize={30} address={s.pkh} mr={4} />
              <Text size="sm">{s.name}</Text>
            </>
          </ListItem>
          {i !== suggestions.length - 1 && <Divider />}
        </Box>
      ))}
    </UnorderedList>
  );
};

export const RecipientAutoCompleteDisplay: React.FC<BaseProps & { contacts: Contact[] }> = ({
  contacts,
  onValidPkh,
  initialPkhValue,
  isDisabled,
  onBlur = () => {},
}) => {
  const initialValue = initialPkhValue
    ? contacts.find(e => e.pkh === initialPkhValue)?.name || initialPkhValue
    : "";

  const [value, setValue] = useState(initialValue);
  const [hideSuggestions, setHideSuggestions] = useState(true);

  const handleChange = (v: string) => {
    setHideSuggestions(false);

    const contact = contacts.find(c => c.name === v || c.pkh === v);

    if (contact !== undefined) {
      setValue(contact.name);
      onValidPkh(contact.pkh);
      return;
    }

    setValue(v);

    if (addressIsValid(v)) {
      onValidPkh(v);
      return;
    }

    onValidPkh(null);
  };

  const suggestions = getSuggestions(value, contacts);

  return (
    <Box>
      <Input
        isDisabled={isDisabled}
        aria-label="recipient"
        value={value}
        onFocus={() => {
          setHideSuggestions(false);
        }}
        onBlur={e => {
          e.preventDefault();
          setHideSuggestions(true);
          onBlur();
        }}
        onChange={e => {
          handleChange(e.target.value);
        }}
        autoComplete={"off"}
        placeholder="Enter tz address or contact name"
      />
      <Suggestions
        hideSuggestions={hideSuggestions}
        suggestions={suggestions}
        onChange={handleChange}
      />
    </Box>
  );
};

export const RecipentAutoComplete: React.FC<BaseProps> = props => {
  const contacts = Object.values(useAppSelector(s => s.contacts));

  const accounts = useAllAccounts().map(a => ({
    name: a.label,
    pkh: a.pkh,
  }));

  return <RecipientAutoCompleteDisplay {...props} contacts={contacts.concat(accounts)} />;
};
