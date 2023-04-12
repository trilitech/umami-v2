import { TezosNetwork } from "@airgap/tezos";
import { useToast } from "@chakra-ui/react";
import { Estimate } from "@taquito/taquito";
import { useState } from "react";
import { AccountType } from "../../types/Account";
import { UmamiEncrypted } from "../../types/UmamiEncrypted";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import {
  estimateDelegation,
  estimateFA2transfer,
  estimateTezTransfer,
} from "../../utils/tezos";
import { FillStep } from "./steps/FillStep";
import { RecapDisplay } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { SendFormMode, TransactionValues } from "./types";

const makeSimulation = (
  t: TransactionValues,
  pk: string,
  network: TezosNetwork
) => {
  if (t.type === "delegation") {
    return estimateDelegation(t.values.sender, t.values.recipient, pk, network);
  }

  if (t.type === "nft") {
    const nft = t.data;

    return estimateFA2transfer(
      {
        amount: t.values.amount,
        sender: nft.owner,
        recipient: t.values.recipient,
        contract: nft.contract,
        tokenId: nft.tokenId,
      },
      pk,
      network
    );
  }

  if (t.type === "tez") {
    return estimateTezTransfer(
      t.values.sender,
      t.values.recipient,
      t.values.amount,
      pk,
      network
    );
  }

  return Promise.reject(`Unrecognized type!`);
};

export const useGetPkAndEsk = () => {
  const accounts = useAccounts();

  return (pkh: string) => {
    const account = accounts.find((a) => a.pkh === pkh);
    if (!account) {
      throw new Error("No account found");
    }

    if (account.type === AccountType.MNEMONIC) {
      return { esk: account.esk, pk: account.pk };
    } else {
      return { esk: undefined, pk: account.pk };
    }
  };
};

export const SendForm = ({
  sender,
  recipient,
  mode = { type: "tez" },
}: {
  sender?: string;
  recipient?: string;
  mode?: SendFormMode;
}) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getPkAndEsk = useGetPkAndEsk();

  const [isLoading, setIsLoading] = useState(false);

  const [transferValues, setTransferValues] = useState<{
    transaction: TransactionValues;
    estimate: Estimate;
    esk: UmamiEncrypted | undefined;
  }>();

  const [hash, setHash] = useState<string>();

  const simulate = async (transaction: TransactionValues) => {
    setIsLoading(true);
    try {
      const sender = transaction.values.sender;

      const { pk, esk } = getPkAndEsk(sender);

      // pk needed for simulation
      const estimate = await makeSimulation(transaction, pk, network);

      // esk needed for real transfer
      // If esk is undefined we are using SSO. Hacky.
      // TOOD implement better solution
      setTransferValues({
        transaction,
        estimate,
        esk,
      });
    } catch (error: any) {
      toast({ title: "Invalid transaction", description: error.message });
    }

    setIsLoading(false);
  };

  if (hash) {
    return <SuccessStep hash={hash} network={network} />;
  }

  if (transferValues) {
    return (
      <RecapDisplay
        onSucces={setHash}
        network={network}
        recap={transferValues}
      />
    );
  }

  return (
    <FillStep
      recipient={recipient}
      assetType={mode}
      sender={sender}
      isLoading={isLoading}
      onSubmit={simulate}
    />
  );
};
