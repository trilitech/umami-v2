import {
  Button,
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
  ListItem,
  type ListProps,
  UnorderedList,
} from "@chakra-ui/react";
import { wordlists } from "bip39";
import { useCallback, useEffect, useRef, useState } from "react";
import { type FieldValues, type Path, type RegisterOptions, useFormContext } from "react-hook-form";

import { EyeIcon, EyeSlashIcon } from "../../../../../apps/desktop/src/assets/icons";

const MNEMONIC_VISIBILITY_TIMEOUT = 60000;

type MnemonicAutocompleteProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  validate?: RegisterOptions<T, U>["validate"];
  listProps?: ListProps;
  inputProps?: InputProps;
};

/**
 * Displays an input with autocomplete for bip39 mnemonic words.
 * It is not a fuzzy-search, it matches only the beginning of the word.
 * Has to be wrapped with FormProvider.
 *
 * @param inputName - name of the input (comes from the form this component is wrapped in)
 * @param validate - optional validation for the value in the input
 * @param inputProps - props for the input
 * @param listProps - props for the list of suggestions
 */
export const MnemonicAutocomplete = <T extends FieldValues, U extends Path<T>>({
  inputName,
  validate,
  inputProps,
  listProps,
}: MnemonicAutocompleteProps<T, U>) => {
  const [hidden, setHidden] = useState(true);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const { register, setValue, watch } = useFormContext<T>();

  const value = watch(inputName);

  const matching = wordlists.EN.filter(word => value && word.startsWith(value)).sort();

  const showSuggestions =
    !hidden &&
    matching.length > 0 &&
    // if we found a single match there is no need in the suggestions
    (matching.length > 1 || matching[0] !== value);

  const resetShowMnemonic = useCallback(() => {
    setShowMnemonic(false);
  }, []);

  useEffect(() => {
    if (showMnemonic) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(resetShowMnemonic, MNEMONIC_VISIBILITY_TIMEOUT);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [showMnemonic, resetShowMnemonic]);

  return (
    <>
      <InputGroup height="full">
        <Input
          height="full"
          autoComplete="off"
          data-testid="mnemonic-input"
          onFocus={() => setHidden(false)}
          placeholder="Type here..."
          type={showMnemonic ? "text" : "password"}
          {...register(inputName, {
            required: "Required",
            validate,
            onChange: () => setHidden(false),
            onBlur: () => setHidden(true),
          })}
          {...inputProps}
        />
        {value && (
          <InputRightElement width="fit-content" height="full">
            <Button
              minWidth="fit-content"
              height="full"
              paddingRight="12px"
              onClick={() => setShowMnemonic(val => !val)}
              variant="unstyled"
            >
              {showMnemonic ? (
                <EyeSlashIcon color="currentColor" data-testid="eye-slash-icon" />
              ) : (
                <EyeIcon width="16.5px" color="currentColor" data-testid="eye-icon" />
              )}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      {showSuggestions && (
        <UnorderedList data-testid="suggestions" variant="suggestions" {...listProps}>
          {matching.map(word => (
            <ListItem
              key={word}
              zIndex={1}
              paddingTop="2px"
              fontSize="sm"
              fontWeight={600}
              data-testid="suggestion"
              onMouseDown={() => setValue(inputName, word as any)}
              paddingX="7px"
            >
              {word}
            </ListItem>
          ))}
        </UnorderedList>
      )}
    </>
  );
};
