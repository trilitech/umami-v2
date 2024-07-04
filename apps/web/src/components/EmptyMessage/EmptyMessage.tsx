import { Flex, Text } from "@chakra-ui/react";

type EmptyMessageProps = {
  title: string;
  subtitle: string;
};

export const EmptyMessage = ({ title, subtitle }: EmptyMessageProps) => (
  <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="12px" width="full">
    <Text size={{ base: "xl", lg: "2xl" }} variant="bold">
      No ‘{title}’ to show
    </Text>
    <Text
      size={{
        base: "md",
        lg: "lg",
      }}
    >
      Your {subtitle} will appear here...
    </Text>
  </Flex>
);
