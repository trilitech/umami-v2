import { TezosNetwork } from "@airgap/tezos";
import { useToast } from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { useEffect, useRef, useState } from "react";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import {
  estimateBatch,
  estimateDelegation,
  estimateFA12transfer,
  estimateFA2transfer,
  estimateMutezTransfer,
} from "../../utils/tezos";
import { sumEstimations } from "../../views/batch/batchUtils";
import { FillStep } from "./steps/FillStep";
import { RecapDisplay } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, OperationValue, SendFormMode } from "./types";

const makeSimulation = (
  operation: OperationValue | OperationValue[],
  pk: string,
  pkh: string,
  network: TezosNetwork
) => {
  if (Array.isArray(operation)) {
    return estimateBatch(operation, pkh, pk, network);
  }

  switch (operation.type) {
    case "delegation":
      return estimateDelegation(operation.value.sender, operation.value.recipient, pk, network);
    case "token": {
      const base = {
        amount: operation.value.amount,
        sender: operation.value.sender,
        recipient: operation.value.recipient,
        contract: operation.data.contract,
      };

      if (operation.data.type === "fa1.2") {
        return estimateFA12transfer(base, pk, network);
      }

      return estimateFA2transfer(
        {
          ...base,
          tokenId: operation.data.tokenId,
        },
        pk,
        network
      );
    }

    case "tez":
      return estimateMutezTransfer(
        operation.value.sender,
        operation.value.recipient,
        new BigNumber(operation.value.amount),
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
  amount?: string;
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

  const [transferValues, setTransferValues] = useState<EstimatedOperation | undefined>(undefined);

  const [hash, setHash] = useState<string>();

  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    if (hash !== undefined) {
      onSuccessRef.current(hash);
    }
  }, [hash]);

  const simulate = async (operation: OperationValue | OperationValue[]) => {
    setIsLoading(true);
    try {
      const sender = Array.isArray(operation) ? operation[0].value.sender : operation.value.sender;

      const pk = getPk(sender);

      const estimate = await makeSimulation(operation, pk, sender, network);
      const fee = Array.isArray(estimate) ? sumEstimations(estimate) : estimate.suggestedFeeMutez;

      setTransferValues({
        operation,
        fee: String(fee),
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
    return <RecapDisplay onSucces={setHash} network={network} recap={transferValues} />;
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
      onSubmitBatch={transaction => {
        addToBatch(transaction);
      }}
    />
  );
};
