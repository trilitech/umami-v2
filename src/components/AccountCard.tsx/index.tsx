import { useSelectedAccount } from "../../utils/hooks/accountHooks";
import {
  useGetAccountBalance,
  useGetDollarBalance,
} from "../../utils/hooks/assetsHooks";
import { mutezToTez } from "../../utils/store/impureFormat";
import { useSendFormModal } from "../../views/home/useSendFormModal";
import { AccountCardDisplay } from "./AccountCardDisplay";

export const AccountCard = () => {
  const account = useSelectedAccount();
  const accountBalance = useGetAccountBalance();
  const getDollarBalance = useGetDollarBalance();

  const { modalElement, onOpen } = useSendFormModal();

  if (!account) {
    return null;
  }

  const balance = accountBalance(account.pkh);
  const tez = balance || null;
  const dollarBalance = getDollarBalance(account.pkh);

  return (
    <>
      <AccountCardDisplay
        onSend={() =>
          onOpen({
            mode: { type: "tez" },
            sender: account?.pkh,
          })
        }
        pkh={account.pkh}
        label={account.label || ""}
        tezBalance={tez && mutezToTez(tez)}
        dollarBalance={dollarBalance}
      />
      {modalElement}
    </>
  );
};

export default AccountCard;
