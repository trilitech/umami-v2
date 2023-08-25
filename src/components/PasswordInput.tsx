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
import EyeSlashIcon from "../assets/icons/EyeSlash";
import EyeIcon from "../assets/icons/Eye";
const MIN_LENGTH = 8;

// <T extends FieldValues> is needed to be compatible with the useForm's type parameter (FormData)
// <U extends Path<T>> makes sure that we can pass in only valid inputName that exists in FormData
export type PasswordInputProps<T extends FieldValues, U extends Path<T>> = {
  inputName: U;
  label?: string;
  placeholder?: string;
  required?: string;
  validate?: RegisterOptions<T, U>["validate"];
} & InputProps;

const PasswordInput = <T extends FieldValues, U extends Path<T>>({
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
      <InputGroup mt="12px">
        <Input
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          aria-label={label}
          placeholder={placeholder}
          {...register(inputName, {
            required,
            minLength: {
              value: MIN_LENGTH,
              message: `Your password must be at least ${MIN_LENGTH} characters long`,
            },
            validate,
          })}
          {...rest}
        />
        <InputRightElement>
          <Button tabIndex={-1} variant="unstyled" onClick={() => setShowPassword(val => !val)}>
            {showPassword ? (
              <EyeSlashIcon data-testid="eye-slash-icon" />
            ) : (
              <EyeIcon w="16.5px" data-testid="eye-icon" />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};

export default PasswordInput;
