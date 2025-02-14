import { List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import zxcvbn from "zxcvbn";

import { CheckmarkIcon } from "../assets/icons";

export const PASSWORD_MIN_LENGTH = 12;

type ValidationPath = "minlength" | "uppercase" | "number" | "special" | "simplicity";

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
};

const getPasswordSchema = () =>
  z
    .string()
    .refine(value => value.length >= PASSWORD_MIN_LENGTH, {
      path: ["minlength"],
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
  <List marginTop="12px" spacing="8px">
    {requirements.map(({ message, path, passed }) => (
      <ListItem
        key={path}
        alignItems="flex-start"
        display="flex"
        data-testid={`${path}-${passed ? "passed" : "failed"}`}
      >
        <ListIcon as={CheckmarkIcon} boxSize="18px" color={passed ? "green" : "gray.400"} />
        <Text color="gray.700" size="md">
          {message}
        </Text>
      </ListItem>
    ))}
  </List>
);

const DEFAULT_REQUIREMENTS: Requirement[] = [
  {
    message: `At least ${PASSWORD_MIN_LENGTH} characters long`,
    path: "minlength",
    passed: false,
  },
  {
    message: "At least one uppercase letter",
    path: "uppercase",
    passed: false,
  },
  {
    message: "At least one number",
    path: "number",
    passed: false,
  },
  {
    message: 'At least one special character: !@#$%^&*(),.?":{}|<>',
    path: "special",
    passed: false,
  },
  {
    message: "Good complexity, no simple sequences or patterns",
    path: "simplicity",
    passed: false,
  },
];

export const usePasswordValidation = ({
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
      getPasswordSchema().parse(value);
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
