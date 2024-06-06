import {
  BeaconMessageType,
  OperationRequestOutput,
  OperationResponseInput,
} from "@airgap/beacon-wallet";
import { Estimate, TezosToolkit } from "@taquito/taquito";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { ImplicitOperations } from "../../../types/AccountOperations";
import { WalletClient } from "../../../utils/beacon/WalletClient";
import { useFindNetwork } from "../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { executeOperations } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { SuccessStep } from "../SuccessStep";

export const useSignWithBeacon = (
  operation: ImplicitOperations,
  message: OperationRequestOutput,
  estimations: Estimate[]
) => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const findNetwork = useFindNetwork();

  const form = useForm({
    defaultValues: {
      executeParams: {
        storageLimit: estimations[0].storageLimit,
        gasLimit: estimations[0].gasLimit,
        fee: Math.max(estimations[0].suggestedFeeMutez, estimations[0].totalCost),
      },
    },
  });

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(operation, tezosToolkit, [
          form.getValues("executeParams"),
        ]);

        const response: OperationResponseInput = {
          type: BeaconMessageType.OperationResponse,
          id: message.id,
          transactionHash: opHash,
        };
        await WalletClient.respond(response);

        return openWith(<SuccessStep hash={opHash} />);
      },
      error => ({
        description: `Failed to confirm Beacon operation: ${error.message}`,
      })
    );

  return {
    fee: form.watch("executeParams.fee"),
    isSigning,
    onSign,
    network: findNetwork(message.network.type),
    form,
  };
};
