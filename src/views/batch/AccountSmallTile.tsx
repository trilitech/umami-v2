import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

import { Identicon } from "../../components/Identicon";
import colors from "../../style/colors";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";

/**
 * Component used to display account info for batched transactions.
 *
 * Tile contains icon, account name, address and balance.
 *
 * @param pkh - Account public key hash.
 * @param flexProps - Flex properties to define component style.
 */
export const AccountSmallTile = ({ pkh, ...flexProps }: { pkh: string } & FlexProps) => {
  const account = useAllAccounts().find(a => a.address.pkh === pkh);
  const balance = useGetAccountBalance()(pkh);

  if (!account) {
    return null;
  }
  return (
    <Flex
      alignItems="space-between"
      cursor="pointer"
      data-testid="account-small-tile"
      {...flexProps}
    >
      <Identicon height="30px" marginRight="12px" padding="5px" address={pkh} identiconSize={20} />
      <Flex alignSelf="center" height="20px">
        <Heading marginRight="10px" data-testid="account-small-tile-label" size="sm">
          {account.label}
        </Heading>
        <Text
          marginRight="35px"
          color={colors.gray[300]}
          data-testid="account-small-tile-pkh"
          size="xs"
        >
          {formatPkh(pkh)}
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
