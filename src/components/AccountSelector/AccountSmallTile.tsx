import { FlexProps } from "@chakra-ui/react";
import { useAllAccounts } from "../../utils/hooks/getAccountDataHooks";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

/**
 * Component used to display account info for batched transactions.
 *
 * Tile contains icon, account name, address and balance.
 *
 * @param pkh - Account public key hash.
 * @param flexProps - Flex properties to define component style.
 */
export const AccountSmallTile = ({ pkh, ...flexProps }: { pkh: string } & FlexProps) => {
  const accounts = useAllAccounts();
  const getBalance = useGetAccountBalance();
  const account = accounts.find(a => a.address.pkh === pkh);

  if (!account) {
    return null;
  }
  return (
    <AccountSmallTileDisplay
      balance={getBalance(pkh)}
      label={account.label}
      pkh={account.address.pkh}
      {...flexProps}
    />
  );
};
