import { Button, Flex, type FlexProps, Link, Text } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";

type EmptyMessageProps = {
  title: string;
  subtitle?: string;
  cta?: string;
  ctaUrl?: string;
} & FlexProps;

export const EmptyMessage = ({ title, subtitle, cta, ctaUrl, ...props }: EmptyMessageProps) => {
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
        {title}
      </Text>
      {subtitle && (
        <Text
          textAlign="center"
          whiteSpace="pre-line"
          size={{
            base: "md",
            lg: "lg",
          }}
        >
          {subtitle}
        </Text>
      )}
      {cta && (
        <Button
          as={Link}
          padding="0 24px"
          fontSize="18px"
          href={ctaUrl}
          isExternal
          variant="secondary"
        >
          {cta}
        </Button>
      )}
    </Flex>
  );
};
