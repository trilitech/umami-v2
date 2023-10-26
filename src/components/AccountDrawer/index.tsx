import { useContext } from "react";
import { Account } from "../../types/Account";
import {
  useGetAccountAllTokens,
  useGetAccountBalance,
  useGetAccountNFTs,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { DynamicModalContext } from "../DynamicModal";
import { ReceiveModal } from "../ReceiveModal";
import SendTezForm from "../SendFlow/Tez/FormPage";
import { AccountDrawerDisplay } from "./AccountDrawerDisplay";

// TODO: replace current component with the underlying one
export const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();

  const { openWith } = useContext(DynamicModalContext);

  const balance = accountBalance(account.address.pkh);
  const dollarBalance = getDollarBalance(account.address.pkh);

  const tokens = getTokens(account.address.pkh);
  const nfts = getNFTs(account.address.pkh);

  return (
    <AccountDrawerDisplay
      onSend={() => openWith(<SendTezForm sender={account} />)}
      balance={balance}
      dollarBalance={dollarBalance}
      onReceive={() => {
        openWith(<ReceiveModal pkh={account.address.pkh} />);
      }}
      tokens={tokens}
      nfts={nfts}
      account={account}
    />
  );
};

export default AccountCard;
