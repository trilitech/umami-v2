import { Center, FlexProps, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

import { RefreshClockIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { RawPkh } from "../../../types/Address";

/**
 * Simple link to view all account's assets for one of categories.
 *
 * @param to - route to navigate to (/nfts, /tokens, etc.).
 * @param owner - address of the account for which the drawer was opened.
 */
export const ViewAllLink = ({ to, owner, ...props }: { to: string; owner: RawPkh } & FlexProps) => {
  return (
    <Center {...props}>
      <Link
        as={ReactRouterLink}
        color={colors.gray[300]}
        stroke={colors.gray[450]}
        _hover={{ color: colors.green, stroke: colors.green }}
        to={`${to}?accounts=${owner}`}
      >
        <RefreshClockIcon display="inline" stroke="inherit" />
        <Text display="inline" size="sm">
          &nbsp;View All
        </Text>
      </Link>
    </Center>
  );
};
