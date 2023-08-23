import { FlexProps } from "@chakra-ui/react";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

// TODO: Make this component be able to render not only owned accounts
export const AccountSmallTile = ({ pkh, ...flexProps }: { pkh: string } & FlexProps) => {
  const accounts = useAllAccounts();
  const getBalance = useGetAccountBalance();
  const account = accounts.find(a => a.address.pkh === pkh);

  if (!account) {
    return null;
  }
  return (
    <AccountSmallTileDisplay
      pkh={account.address.pkh}
      label={account.label}
      balance={getBalance(pkh)}
      {...flexProps}
    />
  );
};
