import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

import { AccountTileIcon } from "../../components/AccountTile/AccountTileIcon";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";

/**
 * Component used to display account info for batched transactions.
 *
 * Tile contains icon, account name, address and balance.
 *
 * @param account - Implicit or Multisig account.
 * @param flexProps - Flex properties to define component style.
 */
export const AccountSmallTile = ({ account, ...flexProps }: { account: Account } & FlexProps) => {
  const balance = useGetAccountBalance()(account.address.pkh);

  return (
    <Flex
      alignItems="space-between"
      cursor="pointer"
      data-testid="account-small-tile"
      {...flexProps}
    >
      <AccountTileIcon account={account} size="sm" />
      <Flex alignSelf="center" height="20px" marginLeft="12px">
        <Heading marginRight="10px" data-testid="account-small-tile-label" size="sm">
          {account.label}
        </Heading>
        <Text
          marginRight="35px"
          color={colors.gray[300]}
          data-testid="account-small-tile-pkh"
          size="xs"
        >
          {formatPkh(account.address.pkh)}
        </Text>
        {balance && (
          <Heading data-testid="account-small-tile-balance" size="sm">
            {prettyTezAmount(balance)}
          </Heading>
        )}
      </Flex>
    </Flex>
  );
};
