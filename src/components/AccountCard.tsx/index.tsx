import { AllAccount } from "../../types/Account";
import { mutezToTez } from "../../utils/format";
import {
  useGetAccountAllTokens,
  useGetAccountBalance,
  useGetAccountNFTs,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../../views/home/useSendFormModal";
import { useReceiveModal } from "../ReceiveModal";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard: React.FC<{ account: AllAccount }> = ({ account }) => {
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();
  const { onOpen: onOpenSend, modalElement: sendModal } = useSendFormModal();
  const { onOpen: onOpenReceive, modalElement: receiveModal } =
    useReceiveModal();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance || null;
  const dollarBalance = getDollarBalance(account.pkh);

  const tokens = getTokens(account.pkh);
  const nfts = getNFTs(account.pkh);
  return (
    <>
      <AccountCardDisplay
        onSend={() =>
          onOpenSend({
            mode: { type: "tez" },
            sender: account?.pkh,
          })
        }
        pkh={account.pkh}
        label={account.label || ""}
        tezBalance={tez && mutezToTez(tez)}
        dollarBalance={dollarBalance}
        onReceive={() => {
          onOpenReceive({ pkh: account.pkh });
        }}
        tokens={tokens}
        nfts={nfts}
      />
      {sendModal}
      {receiveModal}
    </>
  );
};

export default AccountCard;
