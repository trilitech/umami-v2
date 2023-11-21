import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import { formatPkh } from "../../utils/formatPkh";
import { Identicon } from "../Identicon";
import { prettyTezAmount } from "../../utils/format";
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
  <Flex data-testid="account-small-tile" alignItems="space-between" cursor="pointer" {...flexProps}>
    <Identicon height="30px" identiconSize={20} p="5px" address={pkh} mr="12px" />
    <Flex height="20px" alignSelf="center">
      <Heading size="sm" mr="10px">
        {label}
      </Heading>
      <Text size="xs" color={colors.gray[300]} mr="35px">
        {formatPkh(pkh)}
      </Text>
      {balance && <Heading size="sm">{prettyTezAmount(balance)}</Heading>}
    </Flex>
  </Flex>
);
