import { TezosNetwork } from "@airgap/tezos";
import { useToast } from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import { useEffect, useRef, useState } from "react";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import {
  estimateDelegation,
  estimateFA12transfer,
  estimateFA2transfer,
  estimateTezTransfer,
} from "../../utils/tezos";
import { getTotalFee } from "../../views/batch/batchUtils";
import { FillStep } from "./steps/FillStep";
import { RecapDisplay } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, SendFormMode, OperationValue } from "./types";

const makeSimulation = (
  operation: OperationValue,
  pk: string,
  network: TezosNetwork
) => {
  switch (operation.type) {
    case "delegation":
      return estimateDelegation(
        operation.value.sender,
        operation.value.recipient,
        pk,
        network
      );
    case "token": {
      if (operation.data.type === "fa1.2") {
        return estimateFA12transfer(
          {
            amount: operation.value.amount,
            sender: operation.value.sender,
            recipient: operation.value.recipient,
            contract: operation.data.contract,
          },
          pk,
          network
        );
      }
      const fat2Token = operation.data;

      return estimateFA2transfer(
        {
          amount: operation.value.amount,
          sender: operation.value.sender,
          recipient: operation.value.recipient,
          contract: fat2Token.contract,
          tokenId: fat2Token.tokenId,
        },
        pk,
        network
      );
    }

    case "tez":
      return estimateTezTransfer(
        operation.value.sender,
        operation.value.recipient,
        operation.value.amount,
        pk,
        network,
        operation.value.parameter
      );
  }
};

export const useGetPk = () => {
  const getAccount = useGetOwnedAccount();
  return (pkh: string) => getAccount(pkh).pk;
};

export const SendForm = ({
  sender,
  recipient,
  parameter,
  amount,
  mode = { type: "tez" },
  disabled = false,
  onSuccess = () => {},
}: {
  sender?: string;
  recipient?: string;
  amount?: number;
  parameter?: TransferParams["parameter"];
  onSuccess?: (hash: string) => void;
  mode?: SendFormMode;
  disabled?: boolean;
}) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getPk = useGetPk();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const initalValues: EstimatedOperation | undefined =
    mode.type === "batch"
      ? {
          operation: mode.data.batch.items.map((b) => b.operation),
          fee: getTotalFee(mode.data.batch.items),
        }
      : undefined;

  const [transferValues, setTransferValues] = useState<
    EstimatedOperation | undefined
  >(initalValues);

  const [hash, setHash] = useState<string>();

  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    if (hash !== undefined) {
      onSuccessRef.current(hash);
    }
  }, [hash]);

  const simulate = async (operation: OperationValue) => {
    setIsLoading(true);
    try {
      const sender = operation.value.sender;

      const pk = getPk(sender);

      // pk needed for simulation
      const estimate = await makeSimulation(operation, pk, network);

      setTransferValues({
        operation,
        fee: estimate.suggestedFeeMutez,
      });
    } catch (error: any) {
      toast({ title: "Invalid transaction", description: error.message });
    }

    setIsLoading(false);
  };

  const addToBatch = async (operation: OperationValue) => {
    const sender = operation.value.sender;

    const pk = getPk(sender);

    try {
      await dispatch(estimateAndUpdateBatch(sender, pk, [operation], network));

      toast({ title: "Transaction added to batch!" });
    } catch (error: any) {
      toast({ title: "Invalid transaction", description: error.message });
    }
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
      disabled={disabled}
      recipient={recipient}
      mode={mode}
      sender={sender}
      amount={amount}
      parameter={parameter}
      isLoading={isLoading}
      onSubmit={simulate}
      onSubmitBatch={(transaction) => {
        addToBatch(transaction);
      }}
    />
  );
};
