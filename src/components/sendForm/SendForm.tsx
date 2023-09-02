import { useToast } from "@chakra-ui/react";
import { TezosToolkit, TransferParams } from "@taquito/taquito";
import { useEffect, useRef, useState } from "react";
import { RawPkh } from "../../types/Address";
import { Operation } from "../../types/Operation";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useClearBatch, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { estimate } from "../../utils/tezos";
import { FillStep } from "./steps/FillStep";
import { SubmitStep } from "./steps/SubmitStep";
import { SuccessStep } from "./steps/SuccessStep";
import { EstimatedOperation, FormOperations, makeFormOperations, SendFormMode } from "./types";
import { makeTransfer } from "./util/execution";

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
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const [transferValues, setTransferValues] = useState<EstimatedOperation | undefined>(undefined);

  const [hash, setHash] = useState<string>();

  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    if (hash !== undefined) {
      onSuccessRef.current(hash);
    }
  }, [hash]);

  const simulate = (operations: FormOperations) =>
    handleAsyncAction(
      async () => {
        const fee = await estimate(operations, network);

        setTransferValues({ operations, fee: fee.toString() });
      },
      { title: "Invalid transaction" }
    );

  const addToBatch = (operation: Operation, senderPkh: RawPkh) =>
    handleAsyncAction(
      async () => {
        console.log("ADD to batch");
        const sender = getAccount(senderPkh);
        const signer = getSigner(sender);
        await dispatch(
          estimateAndUpdateBatch(makeFormOperations(sender, signer, [operation]), network)
        );

        toast({ title: "Transaction added to batch!", status: "success" });
      },
      { title: "Invalid transaction" }
    );

  const execute = async (operations: FormOperations, tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const result = await makeTransfer(operations, tezosToolkit);
      if (mode.type === "batch") {
        // TODO this will have to me moved in a thunk
        clearBatch(operations.sender);
      }
      setHash(result.hash);
      toast({ title: "Success", description: result.hash });

      // user won't see anything immediately on their operations page
      // so we refetch with a delay to let tzkt index the new operation
      setTimeout(() => {
        dispatch(assetsActions.refetch());
      }, 3000);
    });

  if (hash) {
    return <SuccessStep hash={hash} />;
  }

  if (transferValues) {
    return (
      <SubmitStep
        onSubmit={tezosToolkit => execute(transferValues.operations, tezosToolkit)}
        isBatch={mode.type === "batch"}
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
