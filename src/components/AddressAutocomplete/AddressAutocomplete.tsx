import {
  Box,
  Center,
  FormLabel,
  IconProps,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { get } from "lodash";
import { useId, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

import { BaseProps } from "./BaseProps";
import { getSuggestions } from "./getSuggestions";
import { Suggestions } from "./Suggestions";
import { ChevronDownIcon, XMarkIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { isAddressValid, parsePkh } from "../../types/Address";
import { Contact } from "../../types/Contact";
import { useBakerList } from "../../utils/hooks/assetsHooks";
import {
  useAllAccounts,
  useGetOwnedSignersForAccount,
  useImplicitAccounts,
} from "../../utils/hooks/getAccountDataHooks";
import { AddressTile } from "../AddressTile/AddressTile";

export const AddressAutocomplete = <T extends FieldValues, U extends Path<T>>({
  contacts,
  isDisabled,
  isLoading = false,
  allowUnknown,
  inputName,
  onUpdate,
  validate,
  label,
  keepValid,
  style,
  size,
  hideBalance = false,
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
    if (keepValid || !defaultValues) {
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

  const currentRealValue = getValues(inputName);

  const handleChange = (newValue: string) => {
    setRawValue(newValue);
    setSuggestions(getSuggestions(newValue, contacts));

    const contact = contacts.find(contact => contact.name === newValue || contact.pkh === newValue);
    let newRealValue;
    if (contact !== undefined) {
      newRealValue = contact.pkh;
      setHideSuggestions(true);
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

  let state = "raw_input";

  if (isLoading) {
    state = "selected_tile";
  } else if (isDisabled) {
    state = "disabled_tile";
  } else if (currentRealValue) {
    state = "selected_tile";
  }

  const clearInput = () => {
    handleChange("");
    setHideSuggestions(false);
  };

  return (
    <Box data-testid={`address-autocomplete-${inputName}`}>
      <FormLabel htmlFor={inputId}>{label}</FormLabel>
      {state === "disabled_tile" && <AddressTile address={parsePkh(currentRealValue)} />}
      {state === "selected_tile" && (
        <Box
          height="48px"
          background={colors.gray[800]}
          border="1px solid"
          borderColor={colors.gray[500]}
          borderRadius="4px"
          data-testid={`selected-address-tile-${currentRealValue}`}
          onClick={clearInput}
          paddingY={0}
        >
          <Center
            justifyContent="space-between"
            cursor="pointer"
            data-testid="clear-selected-button"
          >
            <AddressTile
              width={size === "short" ? "338px" : "365px"}
              paddingTop="8px"
              background="transparent"
              address={parsePkh(currentRealValue)}
            />
            {keepValid ? (
              <ChevronDownIcon marginRight="12px" data-testid="chevron-icon" />
            ) : (
              <CrossButton marginRight="14px" />
            )}
          </Center>
        </Box>
      )}
      {state === "raw_input" && (
        <InputGroup>
          <Input
            {...style}
            aria-label={inputName}
            autoComplete="off"
            id={inputId}
            onBlur={e => {
              e.preventDefault();
              setHideSuggestions(true);
              if (keepValid && currentRealValue !== e.target.value) {
                // if the user types something invalid and then blurs, we want to keep the last valid value
                return handleChange(currentRealValue);
              }
              handleChange(e.target.value);
            }}
            onChange={e => handleChange(e.target.value)}
            onFocus={() => setHideSuggestions(false)}
            placeholder="Enter address or contact name"
            value={rawValue}
          />
          <InputRightElement>
            {rawValue ? (
              <CrossButton marginRight="0px" onClick={clearInput} />
            ) : (
              <ChevronDownIcon data-testid="chevron-icon" />
            )}
          </InputRightElement>
        </InputGroup>
      )}
      <Input
        {...register<U>(inputName, { required: "Invalid address or contact name", validate })}
        marginBottom={0}
        data-testid={`real-address-input-${inputName}`}
        name={inputName}
        type="hidden"
      />

      {!hideSuggestions && (
        <Suggestions contacts={suggestions} hideBalance={hideBalance} onChange={handleChange} />
      )}
    </Box>
  );
};

const CrossButton = (props: IconProps) => (
  <XMarkIcon marginRight="16px" cursor="pointer" data-testid="clear-input-button" {...props} />
);

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

  return <AddressAutocomplete {...props} contacts={bakers} hideBalance />;
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
      allowUnknown={false}
      contacts={signers}
      isDisabled={signers.length === 1}
      {...props}
    />
  );
};
