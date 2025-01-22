import {
  BeaconErrorType,
  BeaconMessageType,
  type OperationResponseInput,
} from "@airgap/beacon-wallet";
import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import { executeOperations, totalFee } from "@umami/core";
import { WalletClient, useAsyncActionHandler } from "@umami/state";
import { getErrorContext } from "@umami/utils";
import { useForm } from "react-hook-form";

import { SuccessStep } from "../SuccessStep";
import { type CalculatedSignProps, type SdkSignPageProps } from "../utils";

export const useSignWithBeacon = ({
  operation,
  headerProps,
}: SdkSignPageProps): CalculatedSignProps => {
  const { isLoading: isSigning, handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();

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
          id: headerProps.requestId.id.toString(),
          transactionHash: opHash,
        };
        await WalletClient.respond(response);

        return openWith(<SuccessStep hash={opHash} />);
      },
      (error: any) => {
        const context = getErrorContext(error);
        void WalletClient.respond({
          id: headerProps.requestId.id.toString(),
          type: BeaconMessageType.Error,
          errorType: BeaconErrorType.UNKNOWN_ERROR,
        });
        return { description: `Failed to confirm Beacon operation: ${context.description}` };
      }
    );

  return {
    fee: totalFee(form.watch("executeParams")),
    isSigning,
    onSign,
    network: headerProps.network,
  };
};
