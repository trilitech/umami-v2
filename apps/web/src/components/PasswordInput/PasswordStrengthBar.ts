import { Flex, Icon, List, ListItem, Text } from "@chakra-ui/react";
import { CheckmarkIcon } from "../../assets/icons";
import { PasswordRequirement } from "@umami/components";

type PasswordStrengthBarProps = {
  requirements: PasswordRequirement[];
};

export const PasswordStrengthBar = ({ requirements }: PasswordStrengthBarProps) => (
  <Flex flexDirection="column" gap="8px" marginTop="12px">
    <List>
      {requirements.map(({ message, path, passed }) => (
        <ListItem
          key={path}
          alignItems="center"
          display="flex"
          data-testid={`${path}-${passed ? "passed" : "failed"}`}
        >
          <Icon viewBox="0 0 18 18" boxSize="12px" color={passed ? "green.500" : "gray.400"}>
            <CheckmarkIcon />
          </Icon>
          <Text color="gray.700" fontSize="sm">
            {message}
          </Text>
        </ListItem>
      ))}
    </List>
  </Flex>
);
