import {
  BeaconMessageType,
  type OperationRequestOutput,
  type OperationResponseInput,
} from "@airgap/beacon-wallet";
import { type TezosToolkit } from "@taquito/taquito";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { type EstimatedAccountOperations, totalFee } from "../../../types/AccountOperations";
import { WalletClient } from "../../../utils/beacon/WalletClient";
import { useFindNetwork } from "../../../utils/hooks/networkHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { executeOperations } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { SuccessStep } from "../SuccessStep";

export const useSignWithBeacon = (
  operation: EstimatedAccountOperations,
  message: OperationRequestOutput
) => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const findNetwork = useFindNetwork();

  const form = useForm({ defaultValues: { executeParams: operation.estimates } });

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(
          { ...operation, estimates: form.watch("executeParams") },
          tezosToolkit
        );

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
    fee: totalFee(form.watch("executeParams")),
    isSigning,
    onSign,
    network: findNetwork(message.network.type),
    form,
  };
};
