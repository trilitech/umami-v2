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
import { DEFAULT_MIN_LENGTH, usePasswordValidation } from "@umami/components";
import { useState } from "react";
import { type FieldValues, type Path, type RegisterOptions, useFormContext } from "react-hook-form";

import { EyeIcon, EyeOffIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
type PasswordInputProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  label?: string;
  placeholder?: string;
  required?: string | boolean;
  isStrengthCheckEnabled?: boolean;
  minLength?: RegisterOptions<T, U>["minLength"];
  validate?: (val: string) => string | boolean;
} & InputProps & {
    "data-testid"?: string;
  };

export const PasswordInput = <T extends FieldValues, U extends Path<T>>({
  inputName,
  label = "Password",
  placeholder = "Enter your password",
  required = "Password is required",
  minLength = DEFAULT_MIN_LENGTH,
  isStrengthCheckEnabled = false,
  validate,
  ...rest
}: PasswordInputProps<T, U>) => {
  const form = useFormContext<T>();
  const {
    register,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { validatePasswordStrength, PasswordStrengthBar } = usePasswordValidation({
    inputName,
    minLength,
  });

  const color = useColor();

  const error = errors[inputName];
  const errorMessage = error?.message as string;

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

  const registerProps = register(inputName, {
    required,
    validate: handleValidate,
  });

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <InputGroup marginTop="12px">
        <Input
          paddingRight="60px"
          color={color("400")}
          fontSize="18px"
          _focusWithin={{
            color: color("900"),
          }}
          aria-label={label}
          autoComplete="off"
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...registerProps}
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
      {error?.message && (
        <FormErrorMessage data-testid="password-input-error">{errorMessage}</FormErrorMessage>
      )}
      {isStrengthCheckEnabled && PasswordStrengthBar}
    </FormControl>
  );
};

export default PasswordInput;
