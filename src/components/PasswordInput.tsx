import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { FieldValues, Path, RegisterOptions, useFormContext } from "react-hook-form";

import { EyeIcon, EyeSlashIcon } from "../assets/icons";

const MIN_LENGTH = 8;

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
export type PasswordInputProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  label?: string;
  placeholder?: string;
  required?: string | boolean;
  validate?: RegisterOptions<T, U>["validate"];
} & InputProps;

// TODO: add an error message and make it nested under FormControl
export const PasswordInput = <T extends FieldValues, U extends Path<T>>({
  inputName,
  label = "Password",
  placeholder = "Enter your password",
  required = "Password is required",
  validate,
  ...rest
}: PasswordInputProps<T, U>) => {
  const { register } = useFormContext<T>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <InputGroup marginTop="12px">
        <Input
          aria-label={label}
          autoComplete="off"
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...register(inputName, {
            required,
            minLength: {
              value: required ? MIN_LENGTH : 0,
              message: `Your password must be at least ${MIN_LENGTH} characters long`,
            },
            validate,
          })}
          {...rest}
        />
        <InputRightElement>
          <Button onClick={() => setShowPassword(val => !val)} tabIndex={-1} variant="unstyled">
            {showPassword ? (
              <EyeSlashIcon data-testid="eye-slash-icon" />
            ) : (
              <EyeIcon width="16.5px" data-testid="eye-icon" />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
