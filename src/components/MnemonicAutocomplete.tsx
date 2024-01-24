import { Input, InputProps, ListItem, ListProps, UnorderedList } from "@chakra-ui/react";
import { wordlists } from "bip39";
import { useState } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

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

  const { register, setValue, watch } = useFormContext<T>();

  const value = watch(inputName);

  const matching = wordlists.EN.filter(word => value && word.startsWith(value)).sort();

  const showSuggestions =
    !hidden &&
    matching.length > 0 &&
    // if we found a single match there is no need in the suggestions
    (matching.length > 1 || matching[0] !== value);

  return (
    <>
      <Input
        zIndex={0}
        autoComplete="off"
        data-testid="mnemonic-input"
        onFocus={() => setHidden(false)}
        placeholder="Type here..."
        {...register(inputName, {
          required: "Required",
          validate,
          onChange: () => setHidden(false),
          onBlur: () => setHidden(true),
        })}
        {...inputProps}
      />
      {showSuggestions && (
        <UnorderedList data-testid="suggestions" variant="suggestions" {...listProps}>
          {matching.map(word => {
            return (
              <ListItem
                key={word}
                paddingTop="2px"
                fontSize="14px"
                fontWeight={600}
                data-testid="suggestion"
                onMouseDown={() => setValue(inputName, word as any)}
                paddingX="7px"
              >
                {word}
              </ListItem>
            );
          })}
        </UnorderedList>
      )}
    </>
  );
};
