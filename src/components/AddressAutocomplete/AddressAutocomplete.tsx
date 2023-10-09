import { Box, FormLabel, Input, StyleProps } from "@chakra-ui/react";
import { get } from "lodash";
import { useId, useState } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";
import { Account } from "../../types/Account";
import { isAddressValid } from "../../types/Address";
import { Contact } from "../../types/Contact";
import {
  useAllAccounts,
  useGetOwnedSignersForAccount,
  useImplicitAccounts,
} from "../../utils/hooks/accountHooks";
import { useBakerList } from "../../utils/hooks/assetsHooks";
import { useContacts } from "../../utils/hooks/contactsHooks";
import { Suggestions } from "./Suggestions";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  isDisabled?: boolean;
  inputName: U;
  allowUnknown: boolean;
  label: string;
  // do not set the actual input value to an empty string when the user selects an unknown address or in the mid of typing
  // this is useful when the input is used as a select box
  // it is assumed that there is at least one valid suggestion present and one of them is selected
  // TODO: make a separate selector component for that
  keepValid?: boolean;
  onUpdate?: (value: string) => void;
  validate?: RegisterOptions<T, U>["validate"];
  style?: StyleProps;
};

export const getSuggestions = (inputValue: string, contacts: Contact[]): Contact[] => {
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
  style,
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
        {...style}
        id={inputId}
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
