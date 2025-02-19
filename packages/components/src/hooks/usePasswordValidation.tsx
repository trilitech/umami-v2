import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import zxcvbn from "zxcvbn";

export const DEFAULT_MIN_LENGTH = 12;

type ValidationPath = "minLength" | "uppercase" | "number" | "special" | "simplicity";

type Requirement = {
  message: string;
  path: ValidationPath;
  passed: boolean;
};

type PasswordStrengthBarProps = {
  requirements: Requirement[];
};

type UsePasswordValidationProps = {
  color?: string;
  inputName?: string;
  minLength?: number;
};

const getPasswordSchema = (minLength: number) =>
  z
    .string()
    .refine(value => value.length >= minLength, {
      path: ["minLength"],
    })
    .refine(value => /[A-Z]/.test(value), {
      path: ["uppercase"],
    })
    .refine(value => /\d/.test(value), {
      path: ["number"],
    })
    .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      path: ["special"],
    })
    .refine(
      value => {
        const score = zxcvbn(value).score;

        return score > 3;
      },
      {
        path: ["simplicity"],
      }
    );

const PasswordStrengthBar = ({ requirements }: PasswordStrengthBarProps) => (
  <Flex flexDirection="column" gap="8px" marginTop="12px">
    <List>
      {requirements.map(({ message, path, passed }) => (
        <ListItem
          key={path}
          alignItems="center"
          display="flex"
          data-testid={`${path}-${passed ? "passed" : "failed"}`}
        >
          <ListIcon
            as={passed ? CheckIcon : CloseIcon}
            boxSize="12px"
            color={passed ? "green.500" : "red.300"}
          />
          <Text color={passed ? "green.500" : "red.300"} fontSize="sm">
            {message}
          </Text>
        </ListItem>
      ))}
    </List>
  </Flex>
);

const DEFAULT_REQUIREMENTS: Requirement[] = [
  {
    message: `Password must be at least ${DEFAULT_MIN_LENGTH} characters long`,
    path: "minLength",
    passed: false,
  },
  {
    message: "Password must contain at least one uppercase letter",
    path: "uppercase",
    passed: false,
  },
  {
    message: "Password must contain at least one number",
    path: "number",
    passed: false,
  },
  {
    message: "Password must contain at least one special character",
    path: "special",
    passed: false,
  },
  {
    message: "Avoid common passwords, simple patterns and repeated characters",
    path: "simplicity",
    passed: false,
  },
];

export const usePasswordValidation = ({
  minLength = DEFAULT_MIN_LENGTH,
  inputName = "password",
}: UsePasswordValidationProps = {}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(DEFAULT_REQUIREMENTS);

  const {
    formState: { errors, isDirty },
  } = useFormContext();

  const passwordError = errors[inputName];
  const hasRequiredError = passwordError?.type === "required";

  useEffect(() => {
    if (hasRequiredError || !isDirty) {
      setRequirements(DEFAULT_REQUIREMENTS);
    }
  }, [isDirty, hasRequiredError]);

  const validatePasswordStrength = (value: string) => {
    try {
      getPasswordSchema(minLength).parse(value);
      setRequirements(requirements.map(requirement => ({ ...requirement, passed: true })));
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorPaths = new Set(e.errors.map(error => error.path[0]));
        setRequirements(prev =>
          prev.map(requirement => ({
            ...requirement,
            passed: !errorPaths.has(requirement.path),
          }))
        );

        return false;
      }
    }

    return true;
  };

  return {
    validatePasswordStrength,
    PasswordStrengthBar: <PasswordStrengthBar requirements={requirements} />,
  };
};
