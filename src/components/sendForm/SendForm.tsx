import { useToast } from "@chakra-ui/react";
import { Estimate } from "@taquito/taquito";
import React, { useState } from "react";
import { TezTransfer, SendFormDisplay } from "./steps/FillTransactionStep";
import { Account } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { estimate } from "../../utils/tezos";
import { SuccessStep } from "./steps/SuccessStep";
import { RecapDisplay } from "./steps/RecapStep";

const getKeys = (pkh: string, accounts: Account[]) => {
  const account = accounts.find((a) => a.pkh === pkh);
  return account && { esk: account.esk, pk: account.pk };
};

export const SendForm = () => {
  const accounts = useAccounts();
  const network = useSelectedNetwork();
  const toast = useToast();

  let [isLoading, setIsLoading] = useState(false);

  const [estimation, setEstimation] =
    useState<{
      transfer: TezTransfer;
      estimate: Estimate;
      esk: UmamiEncrypted;
    }>();

  const [hash, setHash] = useState<string>();

  const simulate = async (v: TezTransfer) => {
    setIsLoading(true);
    const keys = getKeys(v.sender, accounts);
    if (!keys) {
      return;
    }
    const { pk, esk } = keys;

    try {
      const result = await estimate(
        network,
        v.sender,
        pk,
        v.recipient,
        v.amount
      );

      setEstimation({
        transfer: v,
        estimate: result,
        esk,
      });
    } catch (error: any) {
      toast({ title: "Invalid transaction", description: error.message });
    }

    setIsLoading(false);
  };

  if (hash) {
    return <SuccessStep hash={hash} />;
  }

  return estimation ? (
    <RecapDisplay onSucces={setHash} recap={{ ...estimation, network }} />
  ) : (
    <SendFormDisplay
      isLoading={isLoading}
      accounts={accounts}
      onSubmit={simulate}
    />
  );
};
