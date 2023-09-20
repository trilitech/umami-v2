import { useContext } from "react";
import { Account } from "../../types/Account";
import {
  useGetAccountAllTokens,
  useGetAccountBalance,
  useGetAccountNFTs,
  useGetAccountOperationDisplays,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { DynamicModalContext } from "../DynamicModal";
import { ReceiveModal } from "../ReceiveModal";
import SendTezForm from "../SendFlow/Tez/FormPage";
import { AccountDrawerDisplay } from "./AccountDrawerDisplay";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();
  const getOperations = useGetAccountOperationDisplays();
  const network = useSelectedNetwork();

  const { openWith } = useContext(DynamicModalContext);

  const balance = accountBalance(account.address.pkh);
  const dollarBalance = getDollarBalance(account.address.pkh);

  const tokens = getTokens(account.address.pkh);
  const nfts = getNFTs(account.address.pkh);
  const operations = getOperations(account.address.pkh);
  return (
    <>
      <AccountDrawerDisplay
        onSend={() => openWith(<SendTezForm sender={account} />)}
        pkh={account.address.pkh}
        label={account.label}
        balance={balance}
        dollarBalance={dollarBalance}
        onReceive={() => {
          openWith(<ReceiveModal pkh={account.address.pkh} />);
        }}
        tokens={tokens}
        nfts={nfts}
        operationDisplays={operations}
        account={account}
        network={network}
      />
    </>
  );
};

export default AccountCard;
