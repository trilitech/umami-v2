import { ChangeDelegateNoticeModal } from "./ChangeDelegateNoticeModal";
import { NewDelegateNoticeModal } from "./NewDelegateNoticeModal";
import { type Account } from "../../../types/Account";
import { useGetAccountDelegate } from "../../../utils/hooks/assetsHooks";

export const NoticeModal = ({ account }: { account: Account }) => {
  const delegate = useGetAccountDelegate()(account.address.pkh);

  if (delegate) {
    return <ChangeDelegateNoticeModal account={account} delegate={delegate} />;
  }
  return <NewDelegateNoticeModal account={account} />;
};
