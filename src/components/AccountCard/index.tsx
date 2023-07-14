import { Account } from "../../types/Account";
import { makeDelegation } from "../../types/Delegation";
import { mutezToTez } from "../../utils/format";
import {
  useAllDelegations,
  useGetAccountAllTokens,
  useGetAccountBalance,
  useGetAccountNFTs,
  useGetAccountOperationDisplays,
  useGetDollarBalance,
  useSelectedNetwork,
} from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../../views/home/useSendFormModal";
import { useReceiveModal } from "../ReceiveModal";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const delegation = useAllDelegations()[account.address.pkh];
  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();
  const getOperations = useGetAccountOperationDisplays();
  const network = useSelectedNetwork();

  const { onOpen: onOpenSend, modalElement: sendModal } = useSendFormModal();
  const { onOpen: onOpenReceive, modalElement: receiveModal } = useReceiveModal();

  const balance = accountBalance(account.address.pkh);
  const tez = balance || null;
  const dollarBalance = getDollarBalance(account.address.pkh);

  const delegationOp = delegation ? makeDelegation(delegation) : null;
  const tokens = getTokens(account.address.pkh);
  const nfts = getNFTs(account.address.pkh);
  const operations = getOperations(account.address.pkh);
  return (
    <>
      <AccountCardDisplay
        onSend={() =>
          onOpenSend({
            mode: { type: "tez" },
            sender: account?.address?.pkh,
          })
        }
        onDelegate={opts =>
          onOpenSend({
            mode: { type: "delegation", data: opts },
            sender: account?.address?.pkh,
          })
        }
        pkh={account.address.pkh}
        label={account.label}
        tezBalance={tez && mutezToTez(tez)}
        dollarBalance={dollarBalance}
        onReceive={() => {
          onOpenReceive({ pkh: account.address.pkh });
        }}
        tokens={tokens}
        nfts={nfts}
        operationDisplays={operations}
        account={account}
        network={network}
        delegation={delegationOp}
      />
      {sendModal}
      {receiveModal}
    </>
  );
};

export default AccountCard;
