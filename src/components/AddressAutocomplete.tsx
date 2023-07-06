import { Box, Divider, FormLabel, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormRegister, Path } from "react-hook-form";
import colors from "../style/colors";
import { isAddressValid } from "../types/Address";
import { Contact } from "../types/Contact";
import { useAllAccounts, useImplicitAccounts } from "../utils/hooks/accountHooks";
import { useAppSelector } from "../utils/store/hooks";
import { Identicon } from "./Identicon";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter
// <U extends Path<T>> makes sure that we can pass in only valid inputName that
//   exists in the useForm's type parameter
export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  initialPkhValue?: string;
  isDisabled?: boolean;
  inputName: U;
  allowUnknown: boolean;
  label: string;
  register: UseFormRegister<T>;
  setValue: (name: U, value: string, options: { shouldValidate: boolean }) => void;
};

const getSuggestions = (inputValue: string, contacts: Contact[]): Contact[] => {
  if (inputValue === "") {
    return contacts;
  }

  const result = contacts.filter(contact =>
    contact.name.toLowerCase().includes(inputValue.trim().toLowerCase())
  );

  // No suggestions if it's an exact match
  if (result.length === 1 && result[0].name === inputValue) {
    return [];
  }

  return result;
};

const Suggestions = ({
  contacts,
  onChange,
}: {
  contacts: Contact[];
  onChange: (name: string) => void;
}) => {
  return contacts.length === 0 ? null : (
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
      {contacts.map((contact, i) => (
        <Box key={contact.pkh}>
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
              onChange(contact.name);
            }}
          >
            <>
              <Identicon identiconSize={30} address={contact.pkh} mr={4} />
              <Text size="sm">{contact.name}</Text>
            </>
          </ListItem>
          {i !== contacts.length - 1 && <Divider />}
        </Box>
      ))}
    </UnorderedList>
  );
};

export const AddressAutocomplete = <T extends FieldValues, U extends Path<T>>({
  contacts,
  initialPkhValue,
  isDisabled,
  allowUnknown,
  inputName,
  label,
  register,
  setValue: setFormValue,
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
      } else if (allowUnknown && isAddressValid(newValue)) {
        setFormValue(inputName, newValue, { shouldValidate: true });
      } else {
        setFormValue(inputName, "", { shouldValidate: true });
      }
    },
    [contacts, inputName, setRawInputValue, setFormValue, allowUnknown]
  );

  // on initial render set the real input value to the initialInputValue
  // if it's a valid address or a contact
  useEffect(() => {
    if (initialInputValue) {
      handleChange(initialInputValue);
    }
  }, [initialInputValue, handleChange]);

  return (
    <Box>
      <FormLabel>
        {label}
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

      {!hideSuggestions && <Suggestions contacts={suggestions} onChange={handleChange} />}
    </Box>
  );
};

export const KnownAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const contacts = Object.values(useAppSelector(s => s.contacts));

  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={contacts.concat(accounts)} />;
};

export const OwnedImplicitAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const accounts = useImplicitAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={accounts} />;
};

export const AllAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={accounts} />;
};
