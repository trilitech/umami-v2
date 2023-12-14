import { Center, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

import { RefreshClockIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

/**
 * Simple link to view all assets
 *
 * @param to - route to navigate to (/nfts, /tokens, etc.)
 */
export const ViewAllLink = ({ to }: { to: string }) => {
  return (
    <Center>
      <Link
        as={ReactRouterLink}
        color={colors.gray[300]}
        stroke={colors.gray[450]}
        _hover={{ color: colors.green, stroke: colors.green }}
        to={to}
      >
        <RefreshClockIcon display="inline" stroke="inherit" />
        <Text display="inline" size="sm">
          &nbsp;View All
        </Text>
      </Link>
    </Center>
  );
};
