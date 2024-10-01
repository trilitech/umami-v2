import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { DEFAULT_MIN_LENGTH, usePasswordValidation } from "@umami/components";
import { useState } from "react";
import { type FieldValues, type Path, type RegisterOptions, useFormContext } from "react-hook-form";

import { EyeIcon, EyeSlashIcon } from "../assets/icons";
import colors from "../style/colors";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
type PasswordInputProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  label?: string;
  placeholder?: string;
  isStrengthCheckEnabled?: boolean;
  required?: string | boolean;
  minLength?: RegisterOptions<T, U>["minLength"];
  validate?: (val: string) => string | boolean;
} & InputProps;

// TODO: add an error message and make it nested under FormControl
export const PasswordInput = <T extends FieldValues, U extends Path<T>>({
  inputName,
  label = "Password",
  placeholder = "Enter your password",
  required = "Password is required",
  isStrengthCheckEnabled = false,
  minLength = DEFAULT_MIN_LENGTH,
  validate,
  ...rest
}: PasswordInputProps<T, U>) => {
  const { register } = useFormContext<T>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { validatePasswordStrength, PasswordStrengthBar } = usePasswordValidation({
    color: colors.gray[500],
    inputName,
    minLength,
  });

  const handleValidate = (val: string) => {
    if (validate) {
      const validationResult = validate(val);

      if (isStrengthCheckEnabled && validationResult === true) {
        return validatePasswordStrength(val);
      }

      return validationResult;
    } else if (isStrengthCheckEnabled) {
      return validatePasswordStrength(val);
    }
  };

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
            validate: handleValidate,
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
      {isStrengthCheckEnabled && PasswordStrengthBar}
    </>
  );
};
