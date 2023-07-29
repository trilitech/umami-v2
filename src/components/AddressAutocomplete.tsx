import { Box, Divider, FormLabel, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { get } from "lodash";
import { useId, useState } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";
import { Account } from "../types/Account";
import { isAddressValid } from "../types/Address";
import { Contact } from "../types/Contact";
import {
  useAllAccounts,
  useGetOwnedSignersForAccount,
  useImplicitAccounts,
} from "../utils/hooks/accountHooks";
import { useBakerList } from "../utils/hooks/assetsHooks";
import { useContacts } from "../utils/hooks/contactsHooks";
import { Identicon } from "./Identicon";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  isDisabled?: boolean;
  inputName: U;
  allowUnknown: boolean;
  label: string;
  // do not set the actual input value to an empty string when the user selects an unknown address or in the mid of typing
  // this is useful when the input is used as a select box
  // TODO: make a separate selector component for that
  keepValid?: boolean;
  onUpdate?: (value: string) => void;
  validate?: RegisterOptions<T, U>["validate"];
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

// TODO: Display different types of suggestions differently
// e.g. implicit vs contract vs contact vs baker
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
              <Identicon identiconSize={20} p="5px" address={contact.pkh} mr={4} />
              <Text size="sm">{contact.name}</Text>
            </>
          </ListItem>
          {i !== contacts.length - 1 && <Divider />}
        </Box>
      ))}
    </UnorderedList>
  );
};

// TODO: add chevron and cross buttons
export const AddressAutocomplete = <T extends FieldValues, U extends Path<T>>({
  contacts,
  isDisabled,
  allowUnknown,
  inputName,
  onUpdate,
  validate,
  label,
  keepValid,
}: BaseProps<T, U> & { contacts: Contact[] }) => {
  const {
    register,
    setValue,
    formState: { defaultValues },
    getValues,
  } = useFormContext<T>();
  // Cannot avoid this cast because of how types are arranged in UseFormReturn
  const setRealValue = setValue as (
    name: U,
    value: string,
    options: { shouldValidate: boolean }
  ) => void;
  const inputId = useId();

  const [rawValue, setRawValue] = useState(() => {
    if (!defaultValues) {
      return "";
    }
    const defaultAddress = get(defaultValues, inputName);
    if (!defaultAddress) {
      return "";
    }
    return contacts.find(c => c.pkh === defaultAddress)?.name || defaultAddress;
  });
  const [hideSuggestions, setHideSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState(getSuggestions("", contacts));

  const handleChange = (newValue: string) => {
    setRawValue(newValue);
    setSuggestions(getSuggestions(newValue, contacts));

    const contact = contacts.find(contact => contact.name === newValue || contact.pkh === newValue);
    let newRealValue;
    if (contact !== undefined) {
      setRawValue(contact.name);
      newRealValue = contact.pkh;
    } else if (allowUnknown && isAddressValid(newValue)) {
      newRealValue = newValue;
      // TODO: test
    } else if (keepValid) {
      return;
    } else {
      newRealValue = "";
    }

    setRealValue(inputName, newRealValue, { shouldValidate: true });
    if (onUpdate) {
      onUpdate(newRealValue);
    }
  };

  return (
    <Box data-testid={`address-autocomplete-${inputName}`}>
      <FormLabel htmlFor={inputId}>{label}</FormLabel>

      <Input
        id={inputId}
        variant="filled"
        isDisabled={isDisabled}
        aria-label={inputName}
        value={rawValue}
        onFocus={() => {
          setHideSuggestions(false);
        }}
        onBlur={e => {
          e.preventDefault();
          setHideSuggestions(true);
          if (keepValid && getValues(inputName) !== e.target.value) {
            // if the user types something invalid and then blurs, we want to keep the last valid value
            handleChange(getValues(inputName));
          } else {
            handleChange(e.target.value);
          }
        }}
        onChange={e => {
          handleChange(e.target.value);
        }}
        autoComplete="off"
        placeholder="Enter address or contact name"
      />
      <Input
        {...register<U>(inputName, { required: "Invalid address or contact name", validate })}
        mb={0}
        name={inputName}
        type="hidden"
        data-testid={`real-address-input-${inputName}`}
      />

      {!hideSuggestions && <Suggestions contacts={suggestions} onChange={handleChange} />}
    </Box>
  );
};

export const KnownAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const contacts = Object.values(useContacts());

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

export const OwnedAccountsAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const accounts = useAllAccounts().map(account => ({
    name: account.label,
    pkh: account.address.pkh,
  }));

  return <AddressAutocomplete {...props} contacts={accounts} />;
};

export const BakersAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: BaseProps<T, U>
) => {
  const bakers = useBakerList().map(baker => ({
    name: baker.name,
    pkh: baker.address,
  }));

  return <AddressAutocomplete {...props} contacts={bakers} />;
};

export const AvailableSignersAutocomplete = <T extends FieldValues, U extends Path<T>>(
  props: Omit<BaseProps<T, U>, "allowUnknown"> & { account: Account }
) => {
  const getSigners = useGetOwnedSignersForAccount();
  const signers = getSigners(props.account).map(signer => ({
    name: signer.label,
    pkh: signer.address.pkh,
  }));

  return (
    <AddressAutocomplete
      contacts={signers}
      isDisabled={signers.length === 1}
      allowUnknown={false}
      {...props}
    />
  );
};
