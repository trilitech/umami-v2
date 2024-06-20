import { Flex, Link } from "@chakra-ui/react";

import colors from "../../styles/colors";

export const Footer = () => (
  <Flex color={colors.grey[600]} lineHeight="1">
    © 2024 Umami
    <Link
      margin="0 8px"
      padding="0 8px"
      borderColor={`${colors.grey[300]} !important`}
      borderRight="1px solid"
      borderLeft="1px solid"
      href="https://umamiwallet.com/tos.html"
      target="_blank"
    >
      Terms
    </Link>
    <Link href="https://umamiwallet.com/privacypolicy.html" target="_blank">
      Privacy
    </Link>
  </Flex>
);
