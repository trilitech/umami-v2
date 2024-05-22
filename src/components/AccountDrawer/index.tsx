import { useContext } from "react";

import { AccountDrawerDisplay } from "./AccountDrawerDisplay";
import { RawPkh } from "../../types/Address";
import { useGetAccountAllTokens, useGetAccountNFTs } from "../../utils/hooks/assetsHooks";
import { useGetOwnedAccount } from "../../utils/hooks/getAccountDataHooks";
import { sortedByLastUpdate } from "../../utils/token/utils";
import { DynamicModalContext } from "../DynamicModal";
import { ReceiveModal } from "../ReceiveModal";
import { FormPage as SendTezForm } from "../SendFlow/Tez/FormPage";

// TODO: replace current component with the underlying one
export const AccountCard: React.FC<{ accountPkh: RawPkh }> = ({ accountPkh }) => {
  const getOwnedAccount = useGetOwnedAccount();

  const getTokens = useGetAccountAllTokens();
  const getNFTs = useGetAccountNFTs();

  const { openWith } = useContext(DynamicModalContext);

  const account = getOwnedAccount(accountPkh);

  const tokens = getTokens(accountPkh);
  const nfts = sortedByLastUpdate(getNFTs(accountPkh));

  return (
    <AccountDrawerDisplay
      account={account}
      nfts={nfts}
      onReceive={() => openWith(<ReceiveModal pkh={accountPkh} />)}
      onSend={() => openWith(<SendTezForm sender={account} />)}
      tokens={tokens}
    />
  );
};
