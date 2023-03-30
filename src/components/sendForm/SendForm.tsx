import { useToast } from "@chakra-ui/react";
import { Estimate } from "@taquito/taquito";
import React, { useState } from "react";
import {
  TransferFormValuesBase,
  SendFormDisplay,
} from "./steps/FillTransactionStep";
import { Account } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { estimateTezTransfer, estimateFA2transfer } from "../../utils/tezos";
import { SuccessStep } from "./steps/SuccessStep";
import { RecapDisplay } from "./steps/RecapStep";
import { NFT } from "../../types/Asset";

const getKeys = (pkh: string, accounts: Account[]) => {
  const account = accounts.find((a) => a.pkh === pkh);
  return account && { esk: account.esk, pk: account.pk };
};

export const SendForm = ({ sender, nft }: { sender?: string; nft?: NFT }) => {
  const accounts = useAccounts();
  const network = useSelectedNetwork();
  const toast = useToast();

  let [isLoading, setIsLoading] = useState(false);

  const [estimation, setEstimation] =
    useState<{
      transfer: TransferFormValuesBase;
      nft?: NFT;
      estimate: Estimate;
      esk: UmamiEncrypted;
    }>();

  const [hash, setHash] = useState<string>();

  const simulate = async (v: TransferFormValuesBase, nft?: NFT) => {
    setIsLoading(true);
    const keys = getKeys(v.sender, accounts);
    if (!keys) {
      return;
    }
    const { pk, esk } = keys;

    try {
      const estimation = await (nft
        ? estimateFA2transfer(
            {
              amount: v.amount,
              sender: nft.owner,
              recipient: v.recipient,
              contract: nft.contract,
              tokenId: nft.tokenId,
            },
            pk,
            network
          )
        : estimateTezTransfer(v.sender, v.recipient, v.amount, pk, network));

      setEstimation({
        transfer: v,
        estimate: estimation,
        esk,
        nft,
      });
    } catch (error: any) {
      toast({ title: "Invalid transaction", description: error.message });
    }

    setIsLoading(false);
  };

  if (hash) {
    return <SuccessStep hash={hash} network={network} />;
  }

  return estimation ? (
    <RecapDisplay onSucces={setHash} recap={{ ...estimation, network }} />
  ) : (
    <SendFormDisplay
      nft={nft}
      sender={sender}
      isLoading={isLoading}
      accounts={accounts}
      onSubmit={(values) => {
        simulate(values, nft);
      }}
    />
  );
};
