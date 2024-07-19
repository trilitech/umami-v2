import { type Account } from "@umami/core";
import { useGetAccountDelegate } from "@umami/state";

import { ChangeDelegateNoticeModal } from "./ChangeDelegateNoticeModal";
import { NewDelegateNoticeModal } from "./NewDelegateNoticeModal";

export const NoticeModal = ({ account }: { account: Account }) => {
  const delegate = useGetAccountDelegate()(account.address.pkh);

  if (delegate) {
    return <ChangeDelegateNoticeModal account={account} delegate={delegate} />;
  }
  return <NewDelegateNoticeModal account={account} />;
};
