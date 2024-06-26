import { Flex, Link, Text, useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { dark, light } from "../../styles/colors";

export const Footer = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex lineHeight="1">
      <Text>© 2024 Umami</Text>
      <Link
        margin="0 8px"
        padding="0 8px"
        borderColor={`${mode(light.grey[300], dark.grey[300])({ colorMode })} !important`}
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
