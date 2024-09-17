import { Flex, Link, Text } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";

export const Footer = () => {
  const color = useColor();

  return (
    <Flex
      justifyContent={{
        base: "center",
        md: "flex-start",
      }}
      fontSize={{
        base: "sm",
        md: "md",
      }}
      lineHeight="1"
    >
      <Text>© 2024 Umami</Text>
      <Link
        margin="0 8px"
        padding="0 8px"
        borderColor={`${color("300")} !important`}
        borderRight="1px solid"
        borderLeft="1px solid"
        href="https://umamiwallet.com/tos.html"
        isExternal
      >
        Terms
      </Link>
      <Link href="https://umamiwallet.com/privacypolicy.html" isExternal>
        Privacy
      </Link>
    </Flex>
  );
};
