import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import zxcvbn from "zxcvbn";

export const DEFAULT_MIN_LENGTH = 12;

const DEFAULT_SCORE = 0;
const DEFAULT_COLOR = "gray.100";
const DEFAULT_PASSWORD_FIELD_NAME = "password";

type PasswordStrengthBarProps = {
  score: number;
  color: string;
  hasError: boolean;
};

type UsePasswordValidationProps = {
  color?: string;
  inputName?: string;
  minLength?: number;
};

const PASSWORD_REQUIREMENTS_COUNT = 4;
const getPasswordSchema = (minLength: number) =>
  z
    .string()
    .min(minLength, { message: `Password must be at least ${minLength} characters long` })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    });

const PasswordStrengthBar = ({ score, color, hasError }: PasswordStrengthBarProps) => {
  const colors = [color, "red.500", "yellow.500", "green.500"];

  const getSectionColor = (index: number) => {
    switch (score) {
      case 1:
      case 2:
        return index === 0 ? colors[1] : colors[0];
      case 3:
        return index <= 1 ? colors[2] : colors[0];
      case 4:
        return colors[3];
      default:
        return colors[0];
    }
  };

  const showPasswordStrengthText = !hasError && score === 4;

  return (
    <Flex flexDirection="column" gap="8px" marginTop="12px">
      <Flex gap="4px" height="6px">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            flex="1"
            background={getSectionColor(index)}
            borderRadius="8px"
            transition="background-color 0.2s ease"
          />
        ))}
      </Flex>
      {showPasswordStrengthText && (
        <Text lineHeight="normal" data-testid="password-strength-text" size="sm">
          Your password is strong
        </Text>
      )}
    </Flex>
  );
};

export const usePasswordValidation = ({
  color = DEFAULT_COLOR,
  inputName = DEFAULT_PASSWORD_FIELD_NAME,
  minLength = DEFAULT_MIN_LENGTH,
}: UsePasswordValidationProps = {}) => {
  const [passwordScore, setPasswordScore] = useState(DEFAULT_SCORE);
  const form = useFormContext();

  const passwordError = form.formState.errors[inputName];

  useEffect(() => {
    if (passwordError?.type === "required") {
      setPasswordScore(DEFAULT_SCORE);
    }
  }, [passwordError]);

  const validatePasswordStrength = (value: string) => {
    const result = zxcvbn(value);
    let schemaErrors = 0;

    try {
      getPasswordSchema(minLength).parse(value);
    } catch (e) {
      if (e instanceof z.ZodError) {
        schemaErrors = e.errors.length;
        return e.errors[0].message;
      }
    } finally {
      const requirementsMeetingPercentage = (PASSWORD_REQUIREMENTS_COUNT - schemaErrors) / 4;
      setPasswordScore(Math.ceil(result.score * requirementsMeetingPercentage));
    }

    if (result.score < 4) {
      return result.feedback.suggestions.at(-1) ?? "Keep on, make the password more complex!";
    }

    return true;
  };

  return {
    validatePasswordStrength,
    PasswordStrengthBar: (
      <PasswordStrengthBar color={color} hasError={!!passwordError} score={passwordScore} />
    ),
  };
};
