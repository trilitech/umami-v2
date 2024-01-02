import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";

import { AddressTileIcon } from "../../components/AddressTile/AddressTileIcon";
import { useAddressKind } from "../../components/AddressTile/useAddressKind";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";

/**
 * Component used to display account info for batched transactions.
 *
 * Tile contains icon, account name, address and balance.
 *
 * @param account - Implicit or Multisig account.
 * @param flexProps - Flex properties to define component style.
 */
export const AccountSmallTile = ({
  account: { address },
  ...flexProps
}: { account: Account } & FlexProps) => {
  const account = useAllAccounts().find(a => a.address.pkh === address.pkh);
  const balance = useGetAccountBalance()(address.pkh);
  const addressKind = useAddressKind(address);

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
      <AddressTileIcon addressKind={addressKind} />
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
          {formatPkh(address.pkh)}
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
