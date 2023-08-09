import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

export const AccountSmallTile = ({ pkh }: { pkh: string }) => {
  const accounts = useAllAccounts();
  const account = accounts.find(a => a.address.pkh === pkh);
  return account ? (
    <AccountSmallTileDisplay pkh={account.address.pkh} label={account.label} />
  ) : null;
};
