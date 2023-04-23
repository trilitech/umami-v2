import { Box, Input, ListItem, UnorderedList } from "@chakra-ui/react";
import { validateAddress, ValidationResult } from "@taquito/utils";
import React, { useState } from "react";
import { Contact } from "../../types/Contact";
import { useAppSelector } from "../../utils/store/hooks";

type BaseProps = {
  onValidPkh: (v: string | null) => void;
  initialPkhValue?: string;
};

const getSuggestions = (inputValue: string, contacts: Contact[]): string[] => {
  if (inputValue === "") {
    return [];
  }

  const result = contacts
    .map((c) => c.name)
    .filter((name) =>
      name.toLowerCase().startsWith(inputValue.trim().toLowerCase())
    );

  if (result.length === 1 && result[0] === inputValue) {
    return [];
  }

  return result;
};

export const RecipientAutoCompleteDisplay: React.FC<
  BaseProps & { contacts: Contact[] }
> = ({ contacts, onValidPkh, initialPkhValue }) => {
  const initialValue = initialPkhValue
    ? contacts.find((e) => e.pkh === initialPkhValue)?.name || initialPkhValue
    : "";

  const [value, setValue] = useState(initialValue);

  const handleChange = (v: string) => {
    setValue(v);

    const contactPkh = contacts.find((c) => c.name === v)?.pkh;

    if (contactPkh !== undefined) {
      onValidPkh(contactPkh);
      return;
    }

    const validationResult = validateAddress(v);
    if (validationResult === ValidationResult.VALID) {
      onValidPkh(v);
      return;
    }

    onValidPkh(null);
  };

  const allSuggestions = getSuggestions(value, contacts);

  const renderSuggestions = (suggestions: string[]) => {
    return (
      <UnorderedList
        listStyleType="none"
        position={"fixed"}
        bg="umami.gray.800"
        zIndex={2}
      >
        {suggestions.map((s) => (
          <ListItem key={s} onClick={(_) => handleChange(s)}>
            {s}
          </ListItem>
        ))}
      </UnorderedList>
    );
  };

  return (
    <Box>
      <Input
        aria-label="recipient"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        autoComplete={"off"}
        placeholder="Enter tz address or contact name"
      />
      {renderSuggestions(allSuggestions)}
    </Box>
  );
};

export const RecipentAutoComplete: React.FC<BaseProps> = (props) => {
  const contacts = Object.values(useAppSelector((s) => s.contacts));
  return (
    <RecipientAutoCompleteDisplay
      initialPkhValue={props.initialPkhValue}
      onValidPkh={props.onValidPkh}
      contacts={contacts}
    />
  );
};
