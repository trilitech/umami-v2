import { useToast } from "@chakra-ui/react";
import { TezosToolkit, TransferParams } from "@taquito/taquito";
import { useEffect, useRef, useState } from "react";
import { ImplicitAccount } from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { Operation } from "../../types/Operation";
import { useGetImplicitAccount } from "../../utils/hooks/accountHooks";
import { useClearBatch, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { FillStep } from "./steps/FillStep";
import { SubmitStep } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, FormOperations, SendFormMode } from "./types";
import { makeTransfer } from "./util/execution";
import { makeSimulation } from "./util/simulation";

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
  const dispatch = useAppDispatch();
  const clearBatch = useClearBatch();
  const getAccount = useGetImplicitAccount();

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
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const estimate = await makeSimulation(operations, network);

      setTransferValues({
        operations,
        fee: String(estimate),
      });
    } catch (error: any) {
      console.warn("Simulation Error", error);
      toast({ title: "Invalid transaction", description: error.message, status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const addToBatch = async (operation: Operation, senderPkh: RawPkh) => {
    // TODO: add support for Multisig
    const sender = getAccount(senderPkh) as ImplicitAccount;

    try {
      // TODO: add support for Multisig
      await dispatch(estimateAndUpdateBatch(sender, sender, [operation], network));

      toast({ title: "Transaction added to batch!" });
    } catch (error: any) {
      console.warn("Failed adding transaction to batch", error);
      toast({ title: "Invalid transaction", description: error.message });
    }
  };

  const execute = async (operations: FormOperations, tezosToolkit: TezosToolkit) => {
    // TODO: add support for Multisig
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const result = await makeTransfer(operations, tezosToolkit);
      if (mode.type === "batch") {
        // TODO this will have to me moved in a thunk
        const batchOwner = operations.signer.address.pkh;
        clearBatch(batchOwner);
      }
      setHash(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      console.warn("Failed to execute operation", error);
      toast({ title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (hash) {
    return <SuccessStep hash={hash} network={network} />;
  }

  if (transferValues) {
    return (
      <SubmitStep
        onSubmit={tezosToolkit => execute(transferValues.operations, tezosToolkit)}
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
