import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import zxcvbn from "zxcvbn";

const DEFAULT_SCORE = 0;
const DEFAULT_COLOR = "gray.100";

type PasswordStrengthBarProps = {
  score: number;
  color: string;
  inputName: string;
};

type UsePasswordValidationProps = {
  color?: string;
  inputName?: string;
};

const PasswordStrengthBar = ({ score, color, inputName }: PasswordStrengthBarProps) => {
  const form = useFormContext();

  const colors = [color, "red.500", "yellow.500", "green.500"];
  const passwordError = form.formState.errors[inputName];

  const getColor = (index: number) => {
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

  const getText = () => {
    switch (score) {
      case 1:
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
        return "Strong";
      default:
        return;
    }
  };

  const text = getText();

  return (
    <Flex
      flexDirection="column"
      gap="8px"
      marginTop="12px"
      data-testid={`password-strength-${text}`}
    >
      <Flex gap="4px" height="6px">
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            flex="1"
            background={getColor(index)}
            borderRadius="8px"
            transition="background-color 0.2s ease"
          />
        ))}
      </Flex>
      {!passwordError && text && (
        <Text lineHeight="normal" data-testid="password-strength-text" size="sm">
          Your password is {text}
        </Text>
      )}
    </Flex>
  );
};

export const usePasswordValidation = ({
  color = DEFAULT_COLOR,
  inputName = "password",
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

    setPasswordScore(result.score);

    if (result.score < 4) {
      return result.feedback.suggestions.at(-1);
    }
    return true;
  };

  return {
    validatePasswordStrength,
    PasswordStrengthBar: (
      <PasswordStrengthBar color={color} inputName={inputName} score={passwordScore} />
    ),
  };
};
