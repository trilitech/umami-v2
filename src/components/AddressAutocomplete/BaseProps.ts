import { StyleProps } from "@chakra-ui/react";
import { FieldValues, Path, RegisterOptions } from "react-hook-form";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData

export type BaseProps<T extends FieldValues, U extends Path<T>> = {
  isDisabled?: boolean;
  isLoading?: boolean;
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
  size?: "default" | "short";
  hideBalance?: boolean; // defaults to false
};
