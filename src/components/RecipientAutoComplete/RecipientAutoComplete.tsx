import { Box, Divider, FormLabel, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormRegister, Path } from "react-hook-form";
import colors from "../../style/colors";
import { isAddressValid } from "../../types/Address";
import { Contact } from "../../types/Contact";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useAppSelector } from "../../utils/store/hooks";
import { Identicon } from "../Identicon";

// <T extends FieldValues> is needed to be compatible with the useForm return type
// <U extends Path<T>> makes sure that we can pass in only valid inputName that
//   exists in the useForm's fields type
export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  initialPkhValue?: string;
  isDisabled?: boolean;
  inputName: U;
  register: UseFormRegister<T>;
  setValue: (name: U, value: string, options: { shouldValidate: boolean }) => void;
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
  suggestions,
  onChange,
}: {
  suggestions: Contact[];
  onChange: (name: string) => void;
}) => {
  // TODO: filter suggestions here!
  return suggestions.length === 0 ? null : (
    <UnorderedList
      data-testid="suggestions-list"
      overflowY="auto"
      mt={0}
      ml={0}
      width="100%"
      borderRadius={8}
      listStyleType="none"
      position="absolute"
      bg="umami.gray.500"
      zIndex={2}
      maxHeight={300}
    >
      {suggestions.map((s, i) => (
        <Box key={s.pkh}>
          <ListItem
            display="flex"
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

export const RecipientAutoCompleteDisplay = <T extends FieldValues, U extends Path<T>>({
  contacts,
  initialPkhValue,
  isDisabled,
  register,
  setValue: setFormValue,
  inputName,
}: BaseProps<T, U> & { contacts: Contact[] }) => {
  const initialInputValue = initialPkhValue
    ? contacts.find(c => c.pkh === initialPkhValue)?.name || initialPkhValue
    : "";

  const [rawInputValue, setRawInputValue] = useState(initialInputValue);
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(getSuggestions("", contacts));

  const handleChange = useCallback(
    (newValue: string) => {
      setRawInputValue(newValue);
      setSuggestions(getSuggestions(newValue, contacts));

      const contact = contacts.find(
        contact => contact.name === newValue || contact.pkh === newValue
      );

      if (contact !== undefined) {
        setRawInputValue(contact.name);
        setFormValue(inputName, contact.pkh, { shouldValidate: true });
      } else if (isAddressValid(newValue)) {
        setFormValue(inputName, newValue, { shouldValidate: true });
      } else {
        setFormValue(inputName, "", { shouldValidate: true });
      }
    },
    [contacts, inputName, setRawInputValue, setFormValue]
  );

  useEffect(() => {
    if (initialInputValue) {
      handleChange(initialInputValue);
    }
  }, [initialInputValue, handleChange]);

  return (
    <Box>
      <FormLabel>
        To
        <Input
          isDisabled={isDisabled}
          aria-label={inputName}
          value={rawInputValue}
          onFocus={() => {
            setHideSuggestions(false);
          }}
          onBlur={e => {
            e.preventDefault();
            setHideSuggestions(true);
            handleChange(e.target.value);
          }}
          onChange={e => {
            handleChange(e.target.value);
          }}
          autoComplete="off"
          placeholder="Enter address or contact name"
        />
      </FormLabel>
      <Input
        {...register(inputName, { required: "Invalid address or contact name" })}
        mb={0}
        name={inputName}
        type="hidden"
        data-testid="real-address-input"
      />

      {!hideSuggestions && <Suggestions suggestions={suggestions} onChange={handleChange} />}
    </Box>
  );
};

export const RecipentAutoComplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const contacts = Object.values(useAppSelector(s => s.contacts));

  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <RecipientAutoCompleteDisplay {...props} contacts={contacts.concat(accounts)} />;
};
