import { useToast } from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import { useEffect, useRef, useState } from "react";
import { AccountType } from "../../types/Account";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import { FillStep } from "./steps/FillStep";
import { RecapDisplay } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, FormOperations, OperationValue, SendFormMode } from "./types";
import { makeSimulation } from "./util/simulation";

export const useGetPk = () => {
  const getAccount = useGetOwnedAccount();
  return (pkh: string) => {
    const account = getAccount(pkh);
    if (account.type === AccountType.MULTISIG) {
      throw new Error();
    }
    return account.pk;
  };
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

  const simulate = async (operations: FormOperations) => {
    setIsLoading(true);
    try {
      const estimate = await makeSimulation(operations, getPk, network);

      setTransferValues({
        operations,
        fee: String(estimate),
      });
    } catch (error: any) {
      console.log("Simulation Error", error);
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
        isBatch={mode.type === "batch"}
        onSuccess={setHash}
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
      onSubmitBatch={transaction => {
        addToBatch(transaction);
      }}
    />
  );
};
