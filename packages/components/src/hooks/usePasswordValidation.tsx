import { Box, Collapse, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { type ZodIssue, z } from "zod";
import zxcvbn from "zxcvbn";

export const DEFAULT_MIN_LENGTH = 12;
const DEFAULT_SCORE = 0;
const DEFAULT_COLOR = "gray.100";
const DEFAULT_PASSWORD_FIELD_NAME = "password";
const PASSWORD_REQUIREMENTS_COUNT = 4;

// Types
type ValidationPath = "minLength" | "uppercase" | "number" | "special" | "simple";

type Requirement = {
  message: string;
  path: ValidationPath;
};

type PasswordStrengthBarProps = {
  score: number;
  color: string;
  errors: ZodIssue[];
  hasRequiredError: boolean;
};

type UsePasswordValidationProps = {
  color?: string;
  inputName?: string;
  minLength?: number;
};

const REQUIREMENTS: Requirement[] = [
  {
    message: `Password must be at least ${DEFAULT_MIN_LENGTH} characters long`,
    path: "minLength",
  },
  {
    message: "Password must contain at least one uppercase letter",
    path: "uppercase",
  },
  {
    message: "Password must contain at least one number",
    path: "number",
  },
  {
    message: "Password must contain at least one special character",
    path: "special",
  },
  {
    message: "Avoid common passwords and simple patterns",
    path: "simple",
  },
];

const RoundStatusDot = ({ background }: { background: string }) => (
  <Box
    display="inline-block"
    width="8px"
    height="8px"
    marginRight="5px"
    background={background}
    borderRadius="100%"
  />
);

const getPasswordSchema = (minLength: number) =>
  z
    .string()
    .refine(value => value.length >= minLength, {
      message: `Password must be at least ${minLength} characters long`,
      path: ["minLength"],
    })
    .refine(value => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
      path: ["uppercase"],
    })
    .refine(value => /\d/.test(value), {
      message: "Password must contain at least one number",
      path: ["number"],
    })
    .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
      path: ["special"],
    });

const PasswordStrengthBar = ({
  score,
  color,
  errors,
  hasRequiredError,
}: PasswordStrengthBarProps) => {
  console.log(errors);

  const isPasswordStrong = !errors.length && score === 4;
  const shouldShowRequirements = !!errors.length && !hasRequiredError;

  const checkRequirement = (path: ValidationPath) =>
    !errors.some(error => error.path.includes(path));

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

      {isPasswordStrong && (
        <Text lineHeight="normal" data-testid="password-strength-text" size="sm">
          Your password is strong
        </Text>
      )}

      <Collapse animateOpacity in={shouldShowRequirements}>
        <List>
          {REQUIREMENTS.map(({ message, path }) => (
            <ListItem
              key={path}
              alignItems="center"
              display="flex"
              data-testid={`${path}-${checkRequirement(path) ? "passed" : "failed"}`}
            >
              <RoundStatusDot background={checkRequirement(path) ? "green.500" : "red.300"} />
              <Text color={checkRequirement(path) ? "green.500" : "red.300"} fontSize="sm">
                {message}
              </Text>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Flex>
  );
};

export const usePasswordValidation = ({
  color = DEFAULT_COLOR,
  inputName = DEFAULT_PASSWORD_FIELD_NAME,
  minLength = DEFAULT_MIN_LENGTH,
}: UsePasswordValidationProps = {}) => {
  const [passwordScore, setPasswordScore] = useState(DEFAULT_SCORE);
  const [passwordErrors, setPasswordErrors] = useState<ZodIssue[]>([
    {
      message: "Avoid common passwords and simple patterns",
      path: ["simple"],
    } as ZodIssue,
  ]);

  const {
    formState: { errors, isDirty },
  } = useFormContext();

  const passwordError = errors[inputName];
  const hasRequiredError = passwordError?.type === "required";

  useEffect(() => {
    if (hasRequiredError || !isDirty) {
      setPasswordScore(DEFAULT_SCORE);
    }
  }, [isDirty, hasRequiredError]);

  const validatePasswordStrength = (value: string) => {
    const result = zxcvbn(value);
    let schemaErrors = 0;

    try {
      getPasswordSchema(minLength).parse(value);
      setPasswordErrors([]);
    } catch (e) {
      if (e instanceof z.ZodError) {
        schemaErrors = e.errors.length;
        setPasswordErrors(e.errors);

        return false;
      }
    }

    const requirementsMeetingPercentage = (PASSWORD_REQUIREMENTS_COUNT - schemaErrors) / 4;
    setPasswordScore(Math.ceil(result.score * requirementsMeetingPercentage));

    if (result.score < 4) {
      return false;
    }

    return true;
  };

  return {
    validatePasswordStrength,
    PasswordStrengthBar: (
      <PasswordStrengthBar
        color={color}
        errors={passwordErrors}
        hasRequiredError={hasRequiredError}
        score={passwordScore}
      />
    ),
  };
};
