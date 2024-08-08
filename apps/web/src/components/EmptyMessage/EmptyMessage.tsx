import { Flex, type FlexProps, Text } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";

type EmptyMessageProps = {
  title: string;
  subtitle?: string;
} & FlexProps;

export const EmptyMessage = ({ title, subtitle, ...props }: EmptyMessageProps) => {
  const color = useColor();

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="12px"
      width="full"
      data-testid="empty-state-message"
      {...props}
    >
      <Text color={color("900")} fontWeight="600" size={{ base: "xl", lg: "2xl" }}>
        No {title} to show
      </Text>
      {subtitle && (
        <Text
          size={{
            base: "md",
            lg: "lg",
          }}
        >
          Your {subtitle} will appear here...
        </Text>
      )}
    </Flex>
  );
};
