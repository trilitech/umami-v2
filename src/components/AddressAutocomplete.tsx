import { TezosNetwork } from "@airgap/tezos";
import { Box, Divider, FormLabel, Input, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { get } from "lodash";
import { useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import colors from "../style/colors";
import { isAddressValid } from "../types/Address";
import { Contact } from "../types/Contact";
import { useAllAccounts, useImplicitAccounts } from "../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../utils/hooks/assetsHooks";
import { useContacts } from "../utils/hooks/contactsHooks";
import { useAppSelector } from "../utils/store/hooks";
import { Identicon } from "./Identicon";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  isDisabled?: boolean;
  inputName: U;
  allowUnknown: boolean;
  label: string;
  onUpdate?: (value: string) => void;
  validate?: (value: string) => string | undefined;
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
  isDisabled,
  allowUnknown,
  inputName,
  onUpdate,
  validate,
  label,
}: BaseProps<T, U> & { contacts: Contact[] }) => {
  const {
    register,
    setValue,
    formState: { defaultValues },
  } = useFormContext<T>();
  // Cannot avoid this cast because of how types are arranged in UseFormReturn
  const setRealValue = setValue as (
    name: U,
    value: string,
    options: { shouldValidate: boolean }
  ) => void;

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
      <FormLabel m={0}>
        {label}
        <Input
          isDisabled={isDisabled}
          aria-label={inputName}
          value={rawValue}
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
  const network = useSelectedNetwork();
  const mainnetBakers = useAppSelector(s => s.assets.bakers).map(baker => ({
    name: baker.name,
    pkh: baker.address,
  }));

  const bakers = network === TezosNetwork.MAINNET ? mainnetBakers : [];

  return <AddressAutocomplete {...props} contacts={bakers} />;
};
