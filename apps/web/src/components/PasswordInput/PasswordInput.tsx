import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { type FieldValues, type Path, type RegisterOptions, useFormContext } from "react-hook-form";

import { EyeIcon, EyeOffIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

const MIN_LENGTH = 8;

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
type PasswordInputProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  label?: string;
  placeholder?: string;
  required?: string | boolean;
  minLength?: RegisterOptions<T, U>["minLength"];
  validate?: RegisterOptions<T, U>["validate"];
} & InputProps & {
    "data-testid"?: string;
  };

export const PasswordInput = <T extends FieldValues, U extends Path<T>>({
  inputName,
  label = "Password",
  placeholder = "Enter your password",
  required = "Password is required",
  minLength = MIN_LENGTH,
  validate,
  ...rest
}: PasswordInputProps<T, U>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const color = useColor();

  const error = errors[inputName];
  const errorMessage = error?.message as string;

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <InputGroup marginTop="12px">
        <Input
          aria-label={label}
          autoComplete="off"
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...register(inputName, {
            required,
            minLength:
              minLength && required
                ? {
                    value: minLength,
                    message: `Your password must be at least ${minLength} characters long`,
                  }
                : undefined,
            validate,
          })}
          {...rest}
        />
        <InputRightElement>
          <IconButton
            color={color("400")}
            aria-label="Toggle password visibility"
            icon={
              showPassword ? (
                <EyeOffIcon width="24px" data-testid="eye-off-icon" />
              ) : (
                <EyeIcon width="24px" data-testid="eye-icon" />
              )
            }
            onClick={() => setShowPassword(val => !val)}
            tabIndex={-1}
            variant="unstyled"
          />
        </InputRightElement>
      </InputGroup>

      {error && (
        <FormErrorMessage data-testid={`${rest["data-testid"]}-error`}>
          {errorMessage}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
