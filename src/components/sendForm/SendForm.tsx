import { useToast } from "@chakra-ui/react";
import { TransferParams } from "@taquito/taquito";
import { useEffect, useRef, useState } from "react";
import { AccountType } from "../../types/Account";
import { SignerConfig } from "../../types/SignerConfig";
import { useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useClearBatch, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import { FillStep } from "./steps/FillStep";
import { SubmitStep } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, FormOperations, OperationValue, SendFormMode } from "./types";
import { makeTransfer } from "./util/execution";
import { makeSimulation } from "./util/simulation";

const useGetPk = () => {
  const getAccount = useGetOwnedAccount();
  return (pkh: string) => {
    const account = getAccount(pkh);
    if (account.type === AccountType.MULTISIG) {
      throw new Error(`Multisig accounts don't own a public key`);
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
  onSuccess = () => {},
}: {
  sender: string;
  recipient?: string;
  amount?: string;
  parameter?: TransferParams["parameter"];
  onSuccess?: (hash: string) => void;
  mode: SendFormMode;
}) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getPk = useGetPk();
  const dispatch = useAppDispatch();
  const clearBatch = useClearBatch();

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
      console.warn("Simulation Error", error);
      toast({ title: "Invalid transaction", description: error.message });
    }

    setIsLoading(false);
  };

  const addToBatch = async (operation: OperationValue, sender: string) => {
    const pk = getPk(sender);

    try {
      await dispatch(estimateAndUpdateBatch(sender, pk, [operation], network));

      toast({ title: "Transaction added to batch!" });
    } catch (error: any) {
      console.warn("Failed adding transaction to batch", error);
      toast({ title: "Invalid transaction", description: error.message });
    }
  };

  const execute = async (operations: FormOperations, config: SignerConfig) => {
    setIsLoading(true);

    if (config.type === "ledger") {
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and accept to sign the request",
      });
    }

    try {
      const result = await makeTransfer(operations, config);
      if (mode.type === "batch") {
        // TODO this will have to me moved in a thunk
        const batchOwner = operations.signer.pkh;
        clearBatch(batchOwner);
      }
      setHash(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      console.warn("Failed to execute operation", error);
      toast({ title: "Error", description: error.message });
    }

    setIsLoading(false);
  };

  if (hash) {
    return <SuccessStep hash={hash} network={network} />;
  }

  if (transferValues) {
    return (
      <SubmitStep
        isLoading={isLoading}
        onSubmit={config => {
          execute(transferValues.operations, config);
        }}
        isBatch={mode.type === "batch"}
        network={network}
        recap={transferValues}
      />
    );
  }

  return (
    <FillStep
      recipient={recipient}
      mode={mode}
      sender={sender}
      amount={amount}
      parameter={parameter}
      isLoading={isLoading}
      onSubmit={simulate}
      onSubmitBatch={(transaction, signer) => {
        addToBatch(transaction, signer);
      }}
    />
  );
};
