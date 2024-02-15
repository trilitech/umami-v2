import { useContext } from "react";

import { AccountDrawerDisplay } from "./AccountDrawerDisplay";
import { Account } from "../../types/Account";
import {
  useGetAccountAllTokens,
  useGetAccountBalance,
  useGetAccountNFTs,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { sortedByLastUpdate } from "../../utils/token/utils";
import { DynamicModalContext } from "../DynamicModal";
import { ReceiveModal } from "../ReceiveModal";
import { FormPage as SendTezForm } from "../SendFlow/Tez/FormPage";

// TODO: replace current component with the underlying one
// TODO: use SelectedAccountContext instead of passing account as prop
export const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();

  const { openWith } = useContext(DynamicModalContext);

  const balance = accountBalance(account.address.pkh);
  const dollarBalance = getDollarBalance(account.address.pkh);

  const tokens = getTokens(account.address.pkh);
  const nfts = sortedByLastUpdate(getNFTs(account.address.pkh));

  return (
    <AccountDrawerDisplay
      account={account}
      balance={balance}
      dollarBalance={dollarBalance}
      nfts={nfts}
      onReceive={() => openWith(<ReceiveModal pkh={account.address.pkh} />)}
      onSend={() => openWith(<SendTezForm sender={account} />)}
      tokens={tokens}
    />
  );
};
