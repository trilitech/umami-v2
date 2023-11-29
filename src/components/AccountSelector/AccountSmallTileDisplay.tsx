import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import { formatPkh , prettyTezAmount } from "../../utils/format";
import { Identicon } from "../Identicon";
import colors from "../../style/colors";

/**
 * Component used to display account info for batched transactions.
 *
 * Tile contains icon, account name, address and balance.
 *
 * @param pkh - Account public key hash.
 * @param label - Account label.
 * @param balance - Account balance in mutez.
 * @parma flexProps - Flex properties to define component style.
 */
export const AccountSmallTileDisplay = ({
  pkh,
  label,
  balance,
  ...flexProps
}: {
  pkh: string;
  label?: string;
  balance: string | undefined;
} & FlexProps) => (
  <Flex alignItems="space-between" cursor="pointer" data-testid="account-small-tile" {...flexProps}>
    <Identicon height="30px" marginRight="12px" padding="5px" address={pkh} identiconSize={20} />
    <Flex alignSelf="center" height="20px">
      <Heading marginRight="10px" size="sm">
        {label}
      </Heading>
      <Text marginRight="35px" color={colors.gray[300]} size="xs">
        {formatPkh(pkh)}
      </Text>
      {balance && <Heading size="sm">{prettyTezAmount(balance)}</Heading>}
    </Flex>
  </Flex>
);
