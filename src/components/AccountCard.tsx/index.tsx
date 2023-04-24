import { useSelectedAccount } from "../../utils/hooks/accountHooks";
import {
  useGetAccountAssets,
  useGetAccountBalance,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { useSendFormModal } from "../../views/home/useSendFormModal";
import { useReceiveModal } from "../ReceiveModal";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const getAssets = useGetAccountAssets();
  const { onOpen: onOpenSend, modalElement: sendModal } = useSendFormModal();
  const { onOpen: onOpenReceive, modalElement: receiveModal } =
    useReceiveModal();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance || null;
  const dollarBalance = getDollarBalance(account.pkh);

  const assets = getAssets(account.pkh);
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
        assets={assets}
      />
      {sendModal}
      {receiveModal}
    </>
  );
};

export default AccountCard;
